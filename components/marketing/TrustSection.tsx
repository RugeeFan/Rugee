import { marketingFaqItems } from '../../lib/marketing/faqs'
import SectionHeading from './SectionHeading'

const bestFitItems = [
  'Growing small businesses that are feeling the cost of repeated admin.',
  'Teams that want a direct partner instead of agency layers and handoffs.',
  'Businesses that want to start with one useful improvement, not a giant platform.',
]

const notFitItems = [
  'A pure portfolio-style redesign with no real business process problem behind it.',
  'A huge enterprise-style system planned all at once from day one.',
  'Projects where nobody wants to spend time clarifying the real bottleneck.',
]

export default function TrustSection() {
  return (
    <section id="fit" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Working Together"
          title="A good fit if you want practical help, not agency theatre."
          description="This approach is built for small businesses that want a clearer path to something useful and do not want the project to become heavier than it needs to be."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <InfoCard
            eyebrow="Best Fit"
            title="Usually a strong fit"
            items={bestFitItems}
          />
          <InfoCard
            eyebrow="Not The Best Fit"
            title="Usually not the right project"
            items={notFitItems}
          />
          <article className="rounded-[32px] border border-black/8 bg-section-bg p-7">
            <p className="text-xs uppercase tracking-[0.18em] text-secondary">
              How Projects Start
            </p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight">
              Direct, phased, and shaped around the real bottleneck
            </h3>
            <p className="mt-4 text-base leading-7 text-secondary">
              Most projects start with a clear problem area, not a giant feature list.
              We work out the smallest useful version first, then expand only where it
              creates real value.
            </p>
            <div className="mt-6 space-y-3 text-sm text-primary">
              <p>Reply target: usually within 24 hours.</p>
              <p>Communication: direct with the person shipping the work.</p>
              <p>Scope: can start with one workflow, one section, or one clear fix.</p>
            </div>
          </article>

          <article className="rounded-[32px] border border-black/8 bg-section-bg p-7">
            <p className="text-xs uppercase tracking-[0.18em] text-secondary">
              Common Questions
            </p>
            <div className="mt-5 space-y-5">
              {marketingFaqItems.map(item => (
                <div key={item.question}>
                  <p className="text-base font-medium text-primary">{item.question}</p>
                  <p className="mt-2 text-sm leading-7 text-secondary">{item.answer}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

function InfoCard({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string
  title: string
  items: string[]
}) {
  return (
    <article className="rounded-[32px] border border-black/8 bg-section-bg p-7">
      <p className="text-xs uppercase tracking-[0.18em] text-secondary">
        {eyebrow}
      </p>
      <h3 className="mt-4 text-2xl font-semibold tracking-tight">{title}</h3>
      <ul className="mt-5 space-y-4 text-sm leading-7 text-primary">
        {items.map(item => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-2 w-2 rounded-full bg-black" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}
