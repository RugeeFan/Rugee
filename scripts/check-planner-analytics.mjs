import { spawn } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const APP_URL = process.env.APP_URL ?? 'http://127.0.0.1:3001'
const CHROME_BIN =
  process.env.CHROME_BIN ??
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const DEBUG_PORT = Number(process.env.CDP_PORT ?? '9222')

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function poll(task, options = {}) {
  const timeoutMs = options.timeoutMs ?? 10_000
  const intervalMs = options.intervalMs ?? 250
  const label = options.label ?? 'poll task'
  const start = Date.now()

  // Keep retrying while the page is still loading or the route is changing.
  while (Date.now() - start < timeoutMs) {
    try {
      const result = await task()
      if (result) {
        return result
      }
    } catch {
      // Ignore transient evaluation errors while the page is settling.
    }

    await sleep(intervalMs)
  }

  throw new Error(`Timed out after ${timeoutMs}ms while waiting for ${label}`)
}

function launchChrome() {
  const userDataDir = mkdtempSync(join(tmpdir(), 'rugee-cdp-'))
  const chrome = spawn(
    CHROME_BIN,
    [
      '--headless=new',
      `--remote-debugging-port=${DEBUG_PORT}`,
      `--user-data-dir=${userDataDir}`,
      '--no-first-run',
      '--disable-gpu',
      '--hide-scrollbars',
      '--window-size=390,844',
      'about:blank',
    ],
    {
      stdio: 'ignore',
    },
  )

  return {
    chrome,
    userDataDir,
  }
}

async function getPageTarget() {
  const response = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json`)
  const targets = await response.json()
  return targets.find(target => target.type === 'page')
}

async function connectClient() {
  const target = await poll(() => getPageTarget(), { timeoutMs: 10_000 })
  const ws = new WebSocket(target.webSocketDebuggerUrl)

  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true })
    ws.addEventListener('error', reject, { once: true })
  })

  let nextId = 0
  const pending = new Map()

  ws.addEventListener('message', event => {
    const message = JSON.parse(event.data)
    if (!message.id) return

    const handlers = pending.get(message.id)
    if (!handlers) return

    pending.delete(message.id)

    if (message.error) {
      handlers.reject(new Error(message.error.message))
      return
    }

    handlers.resolve(message.result)
  })

  return {
    async send(method, params = {}) {
      return await new Promise((resolve, reject) => {
        const id = ++nextId
        pending.set(id, { resolve, reject })
        ws.send(JSON.stringify({ id, method, params }))
      })
    },
    close() {
      ws.close()
    },
  }
}

async function evaluate(client, expression) {
  const result = await client.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  })

  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text ?? 'Runtime evaluation failed')
  }

  return result.result?.value
}

function pageCall(fn) {
  return `(${fn.toString()})()`
}

function ensureEvent(events, eventName) {
  return events.some(event => event.event === eventName)
}

async function main() {
  const { chrome, userDataDir } = launchChrome()
  let client

  try {
    console.error('Starting planner analytics smoke check...')
    client = await connectClient()
    console.error('Connected to Chrome DevTools.')

    await client.send('Page.enable')
    await client.send('Runtime.enable')
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    })

    await client.send('Page.navigate', { url: APP_URL })
    await poll(
      async () => (await evaluate(client, 'location.pathname')) === '/',
      { label: 'homepage route' },
    )
    await sleep(750)
    console.error('Homepage loaded.')

    await evaluate(client, 'window.dataLayer = []; true')

    const homepageCta = await poll(
      async () => {
        const result = await evaluate(
          client,
          pageCall(function clickHomepageCta() {
            const buttons = [...document.querySelectorAll('button')]
            const button =
              buttons.find(element =>
                /start the 5-minute planner/i.test((element.textContent || '').trim()),
              ) ??
              buttons.find(element =>
                /start the planner/i.test((element.textContent || '').trim()),
              ) ??
              buttons.find(element => /^plan$/i.test((element.textContent || '').trim()))

            if (!button) {
              throw new Error('Homepage CTA not found')
            }

            const text = button.textContent.trim()
            button.click()

            return {
              text,
              path: location.pathname,
              opensAsPage: window.matchMedia('(max-width: 767px)').matches,
              recordedEvents: (window.dataLayer || []).map(event => event.event),
              viewportWidth: window.innerWidth,
            }
          }),
        )

        if (
          result.path === '/project-brief' ||
          result.recordedEvents.includes('planner_cta_clicked')
        ) {
          return result
        }

        return null
      },
      { timeoutMs: 10_000, label: 'homepage CTA interaction' },
    )
    console.error(`Homepage CTA: ${JSON.stringify(homepageCta)}`)

    await poll(
      async () => (await evaluate(client, 'location.pathname')) === '/project-brief',
      { timeoutMs: 10_000, label: 'planner page route' },
    )
    console.error('Planner page opened from homepage CTA.')

    const afterHomepage = await evaluate(
      client,
      pageCall(function readPlannerEntryState() {
        return {
          path: location.pathname,
          hasSimpleWebsite: [...document.querySelectorAll('button')].some(element =>
            /simple website/i.test((element.textContent || '').trim()),
          ),
          events: window.dataLayer || [],
        }
      }),
    )

    const projectType = await evaluate(
      client,
      pageCall(function chooseProjectType() {
        const button = [...document.querySelectorAll('button')].find(element =>
          /simple website/i.test((element.textContent || '').trim()),
        )

        if (!button) {
          throw new Error('Simple Website option not found')
        }

        const text = button.textContent.trim()
        button.click()
        return text
      }),
    )

    await sleep(350)

    await evaluate(
      client,
      pageCall(function continueFromProjectType() {
        const button = [...document.querySelectorAll('button')].find(
          element => (element.textContent || '').trim() === 'Continue',
        )

        if (!button) {
          throw new Error('Continue button not found')
        }

        button.click()
        return true
      }),
    )

    await poll(
      async () =>
        await evaluate(
          client,
          pageCall(function hasProjectContextQuestion() {
            return /what kind of business is this\?/i.test(document.body.innerText)
          }),
        ),
      { timeoutMs: 10_000, label: 'project context step' },
    )
    console.error('Planner advanced into project context.')

    const finalState = await evaluate(
      client,
      pageCall(function readFinalState() {
        return {
          path: location.pathname,
          events: window.dataLayer || [],
          hasBusinessQuestion: /what kind of business is this\?/i.test(
            document.body.innerText,
          ),
        }
      }),
    )

    const requiredEvents = [
      'planner_cta_clicked',
      'planner_step_viewed',
      'planner_step_completed',
    ]

    const missingEvents = requiredEvents.filter(
      eventName => !ensureEvent(finalState.events, eventName),
    )

    if (!afterHomepage.hasSimpleWebsite) {
      throw new Error('Planner entry page did not render the project-type options')
    }

    if (missingEvents.length > 0) {
      throw new Error(`Missing analytics events: ${missingEvents.join(', ')}`)
    }

    console.log(
      JSON.stringify(
        {
          ok: true,
          route: finalState.path,
          homepageCta,
          projectType,
          hasBusinessQuestion: finalState.hasBusinessQuestion,
          recordedEvents: finalState.events.map(event => event.event),
        },
        null,
        2,
      ),
    )
  } finally {
    client?.close()
    chrome.kill('SIGKILL')
    rmSync(userDataDir, { recursive: true, force: true })
  }
}

main().catch(error => {
  console.error(error.message)
  process.exit(1)
})
