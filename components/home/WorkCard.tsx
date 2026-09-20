'use client'

import { useRef, type CSSProperties } from 'react'
import type { Locale, WorkItem } from '../../lib/home/content'

type WorkCardProps = { item: WorkItem; locale: Locale; visitLabel: string; viewLabel: string; teamLabel: string; flip: boolean }

export default function WorkCard({ item, locale, visitLabel, viewLabel, teamLabel, flip }: WorkCardProps) {
  const frame = useRef<HTMLDivElement | null>(null)

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = frame.current
    if (!el || event.pointerType !== 'mouse') return
    const rect = el.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    el.style.setProperty('--rx', `${(0.5 - py) * 5}deg`)
    el.style.setProperty('--ry', `${(px - 0.5) * 7}deg`)
    el.style.setProperty('--cx', `${px * 100}%`)
    el.style.setProperty('--cy', `${py * 100}%`)
  }
  const onLeave = () => {
    const el = frame.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  const visual = item.image ? (
    <div
      ref={frame}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="work-frame group/frame relative"
      style={{ '--rx': '0deg', '--ry': '0deg', '--cx': '50%', '--cy': '50%' } as CSSProperties}
    >
      <div className={`work-frame-inner overflow-hidden rounded-[20px] border ${item.image.dark ? 'border-black/40 bg-[#0b0b10]' : 'border-black/10 bg-white'} shadow-[0_30px_80px_-30px_rgba(0,0,0,0.28)]`}>
        <div className={`flex items-center gap-1.5 border-b px-4 py-3 ${item.image.dark ? 'border-white/10' : 'border-black/[0.06]'}`}>
          {[0, 1, 2].map(dot => (
            <span key={dot} className={`h-2 w-2 rounded-full ${item.image?.dark ? 'bg-white/20' : 'bg-black/10'}`} />
          ))}
          {item.hrefLabel ? (
            <span className={`ml-3 truncate text-[11px] tracking-wide ${item.image.dark ? 'text-white/40' : 'text-black/35'}`}>{item.hrefLabel}</span>
          ) : null}
        </div>
        <img
          src={item.image.src}
          alt={item.image.alt}
          width={1600}
          height={1000}
          loading="lazy"
          decoding="async"
          className="block aspect-[16/10] w-full object-cover object-top transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/frame:scale-[1.035]"
        />
      </div>
      {item.href ? (
        <span className="work-cursor pointer-events-none absolute z-10 hidden h-20 w-20 items-center justify-center rounded-full bg-primary text-xs font-medium uppercase tracking-[0.14em] text-white md:flex" aria-hidden>
          {viewLabel} ↗
        </span>
      ) : null}
    </div>
  ) : (
    <div className="relative flex aspect-[16/11] items-end overflow-hidden rounded-[20px] bg-primary p-8 text-white sm:p-10">
      <div className="pulse-rings" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <div className="relative">
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">{teamLabel}</p>
        <p className="mt-3 text-5xl font-semibold tracking-tight sm:text-7xl">
          {item.metric?.value}
        </p>
        <p className="mt-2 text-sm text-white/60">{item.metric?.label[locale]}</p>
      </div>
    </div>
  )

  return (
    <article className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
      <div className={`lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}>
        {item.href ? (
          <a href={item.href} target="_blank" rel="noreferrer" aria-label={`${item.name} — ${visitLabel}`} className="block">
            {visual}
          </a>
        ) : (
          visual
        )}
      </div>

      <div className={`lg:col-span-5 ${flip ? 'lg:order-1' : ''}`}>
        <div className="flex items-baseline gap-4 text-sm text-secondary">
          <span className="tabular-nums">{item.index}</span>
          <span className="h-px flex-1 bg-black/10" />
          <span>{item.year}</span>
        </div>
        <h3 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">{item.name}</h3>
        <p className="mt-2 text-sm uppercase tracking-[0.14em] text-secondary">{item.kind[locale]}</p>
        <p className="mt-5 text-lg leading-8 text-primary/90">{item.summary[locale]}</p>

        <ul className="mt-5 space-y-2.5 text-[15px] leading-7 text-secondary">
          {item.points[locale].map(point => (
            <li key={point} className="flex gap-3">
              <span className="mt-[11px] h-1 w-1 shrink-0 rounded-full bg-primary" />
              <span>{point}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-2">
          {item.stack.map(tech => (
            <span key={tech} className="rounded-full border border-black/10 px-3 py-1 text-xs text-secondary">
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3">
          {item.href ? (
            <a href={item.href} target="_blank" rel="noreferrer" className="group/link inline-flex items-center gap-2 text-sm font-medium">
              <span className="link-underline">{visitLabel} {item.hrefLabel}</span>
              <span className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5">↗</span>
            </a>
          ) : null}
          {item.metric && item.image ? (
            <p className="text-sm text-secondary">
              <span className="font-semibold text-primary">{item.metric.value}</span> {item.metric.label[locale]}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  )
}
