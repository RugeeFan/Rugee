'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// Six strings you can pluck. Visuals always work; sound is opt-in (browsers
// require a user gesture before audio, and unexpected sound is rude anyway).

const TUNING = [82.41, 110.0, 146.83, 196.0, 246.94, 329.63] // E2 A2 D3 G3 B3 E4
const WIDTH = 1000
const HEIGHT = 260
const GAP = HEIGHT / (TUNING.length + 1)

type StringState = { amp: number; phase: number; x: number; t0: number }

type StringsProps = { hint: string; soundOn: string; soundOff: string }

export default function Strings({ hint, soundOn, soundOff }: StringsProps) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const pathRefs = useRef<(SVGPathElement | null)[]>([])
  const states = useRef<StringState[]>(TUNING.map(() => ({ amp: 0, phase: 0, x: WIDTH / 2, t0: 0 })))
  const lastY = useRef<number | null>(null)
  const raf = useRef(0)
  const running = useRef(false)
  const audio = useRef<AudioContext | null>(null)
  const [sound, setSound] = useState(false)
  const soundRef = useRef(false)
  const [touched, setTouched] = useState(false)

  const draw = useCallback((now: number) => {
    let alive = false
    states.current.forEach((s, i) => {
      const y = GAP * (i + 1)
      const age = (now - s.t0) / 1000
      const decay = Math.exp(-age * (2.2 + i * 0.35))
      const a = s.amp * decay
      if (Math.abs(a) > 0.15) alive = true
      const offset = a * Math.sin(age * (26 + i * 9) + s.phase)
      const path = pathRefs.current[i]
      if (path) path.setAttribute('d', `M0 ${y} Q ${s.x} ${y + offset * 2} ${WIDTH} ${y}`)
    })
    if (alive) {
      raf.current = requestAnimationFrame(draw)
    } else {
      running.current = false
    }
  }, [])

  const playTone = useCallback((index: number, strength: number) => {
    if (!soundRef.current) return
    const ctx = audio.current
    if (!ctx) return
    const t = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()
    osc.type = 'triangle'
    osc.frequency.value = TUNING[index]
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(2400, t)
    filter.frequency.exponentialRampToValueAtTime(500, t + 1.2)
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(0.16 * strength, t + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.8)
    osc.connect(filter).connect(gain).connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 1.9)
  }, [])

  const pluck = useCallback(
    (index: number, x: number, strength: number) => {
      const s = states.current[index]
      s.amp = 10 + 16 * strength
      s.phase = Math.random() * Math.PI
      s.x = Math.max(80, Math.min(WIDTH - 80, x))
      s.t0 = performance.now()
      playTone(index, strength)
      setTouched(true)
      if (!running.current) {
        running.current = true
        raf.current = requestAnimationFrame(draw)
      }
    },
    [draw, playTone],
  )

  const onPointerMove = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      const svg = svgRef.current
      if (!svg) return
      const rect = svg.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * WIDTH
      const y = ((event.clientY - rect.top) / rect.height) * HEIGHT
      const prev = lastY.current
      lastY.current = y
      if (prev === null) return
      TUNING.forEach((_, i) => {
        const sy = GAP * (i + 1)
        if ((prev - sy) * (y - sy) < 0) {
          pluck(i, x, Math.min(1, Math.abs(y - prev) / 24 + 0.35))
        }
      })
    },
    [pluck],
  )

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const toggleSound = () => {
    const next = !sound
    if (next && !audio.current) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (Ctor) audio.current = new Ctor()
    }
    audio.current?.resume?.()
    soundRef.current = next
    setSound(next)
    if (next) {
      // a quick strum so the toggle gives feedback
      TUNING.forEach((_, i) => window.setTimeout(() => pluck(i, WIDTH * 0.3, 0.7), i * 55))
    }
  }

  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between gap-4 text-sm text-secondary">
        <p className={`transition-opacity duration-700 ${touched ? 'opacity-40' : 'opacity-100'}`}>{hint}</p>
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={sound}
          className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-primary transition hover:bg-black/[0.03]"
        >
          <span className={`h-1.5 w-1.5 rounded-full ${sound ? 'bg-emerald-500' : 'bg-black/25'}`} />
          {sound ? soundOn : soundOff}
        </button>
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        className="block h-44 w-full cursor-crosshair touch-pan-y select-none sm:h-56"
        onPointerMove={onPointerMove}
        onPointerLeave={() => {
          lastY.current = null
        }}
        onPointerDown={event => {
          const svg = svgRef.current
          if (!svg) return
          const rect = svg.getBoundingClientRect()
          const x = ((event.clientX - rect.left) / rect.width) * WIDTH
          const y = ((event.clientY - rect.top) / rect.height) * HEIGHT
          let nearest = 0
          TUNING.forEach((_, i) => {
            if (Math.abs(GAP * (i + 1) - y) < Math.abs(GAP * (nearest + 1) - y)) nearest = i
          })
          pluck(nearest, x, 0.9)
        }}
        role="img"
        aria-label="Six guitar strings that vibrate when the pointer crosses them"
      >
        {TUNING.map((_, i) => {
          const y = GAP * (i + 1)
          return (
            <path
              key={i}
              ref={el => {
                pathRefs.current[i] = el
              }}
              d={`M0 ${y} Q ${WIDTH / 2} ${y} ${WIDTH} ${y}`}
              fill="none"
              stroke="#1A1A1A"
              strokeWidth={3.2 - i * 0.42}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              opacity={0.9}
            />
          )
        })}
      </svg>
    </div>
  )
}
