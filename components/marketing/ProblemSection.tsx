import SectionHeading from './SectionHeading'

const problemItems = [
  'Enquiries come in from different places, and follow-up gets missed.',
  'Quotes, bookings, or approvals still bounce around manually.',
  'Client details live across chat threads, inboxes, and spreadsheets.',
  'The team repeats the same admin steps every single week.',
  'Too much coordination depends on the owner remembering everything.',
  'The website exists, but it does not really reduce the work behind it.',
]

export default function ProblemSection() {
  return (
    <section id="problems" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Common Bottlenecks"
          title="When the business grows, small process gaps start costing real time."
          description="If work is happening across messages, email, notes, and spreadsheets, the next useful step is usually more clarity, not more complexity."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {problemItems.map(item => (
            <article
              key={item}
              className="rounded-[28px] border border-black/8 bg-section-bg p-6 shadow-[0_18px_60px_rgba(0,0,0,0.03)]"
            >
              <div className="flex gap-4">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-black" />
                <p className="text-base leading-7 text-primary">{item}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
