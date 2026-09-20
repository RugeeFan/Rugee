import SectionHeading from './SectionHeading'

const outcomes = [
  {
    title: 'Fewer Manual Steps',
    description:
      'Cut down the repetitive admin, copy-paste work, and double handling that keeps eating time.',
  },
  {
    title: 'Clearer Follow-up',
    description:
      'Give leads, requests, and internal actions a more reliable path so fewer things slip through.',
  },
  {
    title: 'Better Team Handoffs',
    description:
      'Make it easier for work to move between people without depending on memory or scattered notes.',
  },
  {
    title: 'One Cleaner Operating View',
    description:
      'Bring key information into a simpler workflow so the business feels easier to manage day to day.',
  },
]

export default function OutcomesSection() {
  return (
    <section id="outcomes" className="bg-section-bg">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What Gets Simpler"
          title="You are not paying for more software. You are paying for less friction."
          description="The real win is fewer repeated steps, clearer handoffs, and a business that feels easier to run."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {outcomes.map(item => (
            <article
              key={item.title}
              className="rounded-[32px] border border-black/8 bg-white p-7 shadow-[0_18px_60px_rgba(0,0,0,0.04)]"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-secondary">
                Outcome
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
