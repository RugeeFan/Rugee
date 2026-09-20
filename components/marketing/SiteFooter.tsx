import Link from 'next/link'
import { CONTACT_EMAIL, WHATSAPP_URL, SITE_NAME, SITE_TAGLINE } from '../../lib/site'

const footerLinks = [
  { label: 'About Rugee', href: '/', external: false },
  { label: 'Project planner', href: '/project-brief', external: false },
  { label: 'WhatsApp', href: WHATSAPP_URL, external: true },
]

export default function SiteFooter() {
  return (
    <footer className="border-t border-black/8 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-sm font-semibold">{SITE_NAME}</p>
          <p className="mt-1 text-sm text-secondary">
            {SITE_TAGLINE}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-secondary">
          <a href={`mailto:${CONTACT_EMAIL}`} className="transition hover:text-primary">
            {CONTACT_EMAIL}
          </a>
          {footerLinks.map(link => (
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-primary"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="transition hover:text-primary"
              >
                {link.label}
              </Link>
            )
          ))}
        </div>
      </div>
    </footer>
  )
}
