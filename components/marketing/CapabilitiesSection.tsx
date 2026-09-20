import BriefLauncherButton from './BriefLauncherButton'
import SectionHeading from './SectionHeading'
import type { ProjectTypeKey } from '../../lib/brief/types'

const capabilities: Array<{
  title: string
  description: string
  bullets: string[]
  ctaLabel: string
  projectType: ProjectTypeKey
}> = [
  {
    title: 'Lead-generating websites',
    description:
      'Clarify the offer, capture the right enquiries, and stop losing context before the real conversation starts.',
    bullets: [
      'Clear service positioning',
      'Structured enquiry capture',
      'Content that answers common questions',
    ],
    ctaLabel: 'Plan a website project',
    projectType: 'corporate',
  },
  {
    title: 'Lightweight business systems',
    description:
      'Replace scattered manual steps with one simpler place to manage quotes, bookings, approvals, records, or client progress.',
    bullets: [
      'Workflow clarity',
      'Fewer manual handoffs',
      'One cleaner operating view',
    ],
    ctaLabel: 'Plan a workflow system',
    projectType: 'system',
  },
  {
    title: 'Websites and workflows working together',
    description:
      'Connect the front-end and the process behind it so new business does not create extra admin every time it arrives.',
    bullets: [
      'Website and operations alignment',
      'Cleaner client handoff',
      'A simpler path from enquiry to action',
    ],
    ctaLabel: 'Plan the full setup',
    projectType: 'unsure',
  },
]

export default function CapabilitiesSection() {
  return (
    <section id="solutions" className="bg-section-bg">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What I Build"
          title="Three practical ways to make the business run more smoothly."
          description="Some clients need a clearer website. Some need an internal workflow. Many need both connected."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {capabilities.map(item => (
            <article
              key={item.title}
              className="rounded-[28px] border border-black/8 bg-white p-7 shadow-[0_18px_60px_rgba(0,0,0,0.04)]"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-secondary">
                Practical Direction
              </p>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-4 text-base leading-7 text-secondary">
                {item.description}
              </p>

              <ul className="mt-6 space-y-3 text-sm text-primary">
                {item.bullets.map(bullet => (
                  <li key={bullet} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-black" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <BriefLauncherButton
                  label={item.ctaLabel}
                  projectType={item.projectType}
                  className="inline-flex rounded-full border border-black/10 px-5 py-3 text-sm font-medium text-primary transition hover:bg-black/3"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
