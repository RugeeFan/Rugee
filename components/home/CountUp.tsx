'use client'

import { useEffect, useRef, useState } from 'react'

type CountUpProps = { value: number; prefix?: string; suffix?: string; duration?: number }

const format = (n: number) => n.toLocaleString('en-AU')

export default function CountUp({ value, prefix = '', suffix = '', duration = 1400 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !('IntersectionObserver' in window)) return

    let raf = 0
    let started = false
    setDisplay(0)
    const io = new IntersectionObserver(
      entries => {
        if (!entries.some(e => e.isIntersecting) || started) return
        started = true
        io.disconnect()
        const t0 = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - t0) / duration)
          const eased = 1 - Math.pow(1 - t, 4)
          setDisplay(Math.round(value * eased))
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [value, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {format(display)}
      {suffix}
    </span>
  )
}
