import SectionHeading from './SectionHeading'

const processItems = [
  {
    title: 'Find the bottleneck',
    description:
      'Start with the part of the business that is wasting the most time or creating the most confusion.',
  },
  {
    title: 'Scope the simplest useful version',
    description:
      'Define the smallest version that creates real operational value instead of planning something oversized.',
  },
  {
    title: 'Build and launch',
    description:
      'Put the clearer website, workflow, or system in place so the business can start using it for real work.',
  },
  {
    title: 'Improve in phases',
    description:
      'Once the core is working, refine or extend it in stages without forcing the whole project to become heavier than it needs to be.',
  },
]

export default function ProcessSection() {
  return (
    <section id="process" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Process"
          title="Start with the bottleneck, then build the simplest useful fix."
          description="Good small-business systems do not start with a giant spec. They start with the part that wastes the most time."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-4">
          {processItems.map((item, index) => (
            <article
              key={item.title}
              className="rounded-[28px] border border-black/8 bg-section-bg p-7"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-secondary">
                0{index + 1}
              </p>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="mt-4 text-base leading-7 text-secondary">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
