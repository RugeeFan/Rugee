import BriefLauncherButton from './BriefLauncherButton'
import SectionHeading from './SectionHeading'
import { CONTACT_EMAIL, WHATSAPP_URL } from '../../lib/site'

const contactLinks = [
  {
    label: 'WhatsApp',
    href: WHATSAPP_URL,
    external: true,
  },
  {
    label: 'Email',
    href: `mailto:${CONTACT_EMAIL}`,
    external: true,
  },
]

const contactPoints = [
  'You do not need the perfect brief before reaching out.',
  'It is okay to start with one messy workflow instead of a full system.',
  'The next step can be clarified together after a short review.',
]

export default function ContactSection() {
  return (
    <section id="contact" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 rounded-[36px] border border-black/8 bg-section-bg p-8 sm:p-10 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.03)]">
            <p className="text-xs uppercase tracking-[0.18em] text-secondary">
              Before You Reach Out
            </p>
            <ul className="mt-5 space-y-4 text-sm leading-7 text-primary">
              {contactPoints.map(point => (
                <li key={point} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-black" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionHeading
              eyebrow="Contact"
              title="If the business feels harder to run than it should, start there."
              description="Tell me what keeps repeating, what keeps getting missed, or what feels messy. I will help turn that into a sensible next step."
            />

            <div className="mt-8 flex flex-wrap gap-3">
              <BriefLauncherButton label="Start the 5-minute planner" />
              {contactLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noreferrer' : undefined}
                  className="inline-flex rounded-full border border-black/10 px-6 py-3 text-sm font-medium text-primary transition hover:bg-black/3"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
