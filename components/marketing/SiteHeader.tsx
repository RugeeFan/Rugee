import Link from 'next/link'
import BriefLauncherButton from './BriefLauncherButton'

const navItems = [
  { label: 'Problems', href: '#problems' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Process', href: '#process' },
  { label: 'Planner', href: '#brief' },
  { label: 'Contact', href: '#contact' },
]

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/6 bg-white/88 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex min-w-0 items-center gap-3 md:flex-1" aria-label="Rugee — personal site">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white transition-transform duration-500 group-hover:rotate-[-12deg]">
            R
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight">
              Rugee <span className="ml-1 rounded-full border border-black/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-secondary">Studio</span>
            </p>
            <p className="hidden text-xs text-secondary sm:block">
              ← Back to my personal site
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map(item => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-secondary transition hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <a
            href="mailto:Rugee.coder@gmail.com"
            className="hidden rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-primary transition hover:bg-black/3 sm:inline-flex"
          >
            Email
          </a>
          <BriefLauncherButton
            label="Plan"
            className="inline-flex shrink-0 rounded-full bg-black px-3 py-2.5 text-sm font-medium text-white transition hover:bg-black/85 sm:px-5"
          />
        </div>
      </div>
    </header>
  )
}
