'use client'

type AnalyticsValue = string | number | boolean | null | undefined

declare global {
  interface Window {
    dataLayer?: Array<Record<string, AnalyticsValue>>
    gtag?: (...args: unknown[]) => void
    plausible?: (
      eventName: string,
      options?: {
        props?: Record<string, string | number | boolean>
      },
    ) => void
  }
}

function sanitizeProperties(
  properties: Record<string, AnalyticsValue>,
): Record<string, string | number | boolean> {
  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) =>
      ['string', 'number', 'boolean'].includes(typeof value),
    ),
  ) as Record<string, string | number | boolean>
}

export function trackEvent(
  name: string,
  properties: Record<string, AnalyticsValue> = {},
) {
  if (typeof window === 'undefined') {
    return
  }

  const sanitizedProps = sanitizeProperties(properties)
  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push({
    event: name,
    ...sanitizedProps,
  })

  if (typeof window.gtag === 'function') {
    window.gtag('event', name, sanitizedProps)
  }

  if (typeof window.plausible === 'function') {
    window.plausible(name, { props: sanitizedProps })
  }
}
