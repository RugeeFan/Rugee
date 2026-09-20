'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { DICT, LINKS, type Locale } from '../../lib/home/content'

export default function HomeHeader({ locale }: { locale: Locale }) {
  const t = DICT[locale].nav
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrolled(window.scrollY > 24)
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const items = [
    { label: t.work, href: '#work' },
    { label: t.about, href: '#about' },
    { label: t.contact, href: '#contact' },
  ]

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled ? 'border-b border-black/[0.06] bg-white/80 backdrop-blur-md' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href={locale === 'zh' ? '/zh' : '/'} className="group flex items-center gap-3" aria-label="Rugee — home">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white transition-transform duration-500 group-hover:rotate-[-12deg]">
            R
          </span>
          <span className="text-sm font-semibold tracking-tight">Rugee</span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
          {items.map(item => (
            <a key={item.href} href={item.href} className="link-underline text-sm text-secondary transition-colors hover:text-primary">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={t.switchHref}
            className="rounded-full px-3 py-2 text-sm text-secondary transition hover:text-primary"
            hrefLang={locale === 'zh' ? 'en' : 'zh-Hans'}
          >
            {t.switchTo}
          </Link>
          <a
            href={LINKS.resume}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-black/80"
          >
            {t.resume}
          </a>
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 h-px origin-left bg-primary transition-opacity duration-300"
        style={{ width: '100%', transform: `scaleX(${progress})`, opacity: scrolled ? 1 : 0 }}
        aria-hidden
      />
    </header>
  )
}
