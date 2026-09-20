import BriefLauncherButton from './BriefLauncherButton'
import SectionHeading from './SectionHeading'

const proofNotes = [
  'Representative patterns, not inflated case-study theatre.',
  'Focused on where the work starts, not on dressing it up afterward.',
  'Usually delivered in phases so the first version is useful quickly.',
]

const casePatterns = [
  {
    id: '01',
    title: 'Service businesses where quoting still starts from scratch',
    summary:
      'Enquiries are already coming in, but someone still rebuilds the same context from calls, forms, messages, and memory before a quote can move.',
    startsWith:
      'The website captures interest, but the handoff into quoting still depends on manual patching.',
    firstPhase: [
      'A clearer enquiry path on the website',
      'A simple intake structure for the team',
      'A cleaner handoff from enquiry to quoting or follow-up',
    ],
    improvesFirst: ['Less repeated asking', 'Faster quoting', 'Better lead visibility'],
    fit:
      'Best fit when demand exists, but follow-up feels improvised and expensive in time.',
  },
  {
    id: '02',
    title: 'Appointment-led businesses buried in booking admin',
    summary:
      'Booking already works, but confirmations, reschedules, notes, and client context still create too much message traffic.',
    startsWith:
      'The calendar runs, but every change creates more checking, more messages, and more room for missed context.',
    firstPhase: [
      'A simpler booking or intake path',
      'Cleaner client context before appointments',
      'A more reliable process for changes, reminders, or next steps',
    ],
    improvesFirst: [
      'Less back-and-forth',
      'Cleaner client records',
      'A calmer day-to-day flow',
    ],
    fit:
      'Best fit when operations feel heavier than they should for the size of the business.',
  },
  {
    id: '03',
    title: 'Growing teams repeating approvals and status checks every week',
    summary:
      'Work is moving, but there is no shared operating view behind it, so the team keeps rechecking status and chasing the same answers.',
    startsWith:
      'Chats and spreadsheets technically work, but nobody can see the full picture without asking around again.',
    firstPhase: [
      'One clearer internal workflow for the bottleneck that hurts most',
      'Shared visibility across the people involved',
      'A lighter structure for approvals, records, or handoffs',
    ],
    improvesFirst: [
      'Fewer repeated checks',
      'Better internal handoffs',
      'More shared visibility',
    ],
    fit:
      'Best fit when the team is outgrowing informal process, but does not need a huge system to start improving.',
  },
]

export default function SelectedWorkSection() {
  return (
    <section id="proof" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Anonymous Examples"
          title="A more honest look at how projects like this usually begin."
          description="These are representative project shapes based on the kinds of business problems this site is built to solve. The goal is to show where the work usually starts, what phase one often includes, and what tends to feel better first."
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {proofNotes.map(note => (
            <div
              key={note}
              className="rounded-[24px] border border-black/8 bg-section-bg px-5 py-4 text-sm leading-7 text-primary"
            >
              {note}
            </div>
          ))}
        </div>

        <div className="mt-12 space-y-6">
          {casePatterns.map(pattern => (
            <article
              key={pattern.id}
              className="overflow-hidden rounded-[32px] border border-black/8 bg-section-bg"
            >
              <div className="grid gap-0 xl:grid-cols-[minmax(0,1.1fr)_420px]">
                <div className="p-7 sm:p-8">
                  <p className="text-xs uppercase tracking-[0.2em] text-secondary">
                    Representative Pattern {pattern.id}
                  </p>
                  <h3 className="mt-4 max-w-3xl text-2xl font-semibold tracking-tight sm:text-3xl">
                    {pattern.title}
                  </h3>
                  <p className="mt-4 max-w-3xl text-base leading-8 text-secondary">
                    {pattern.summary}
                  </p>

                  <div className="mt-8 rounded-[24px] border border-black/8 bg-white p-5 sm:p-6">
                    <p className="text-xs uppercase tracking-[0.16em] text-secondary">
                      Where It Usually Starts
                    </p>
                    <p className="mt-3 text-sm leading-7 text-primary">
                      {pattern.startsWith}
                    </p>
                  </div>
                </div>

                <div className="border-t border-black/8 bg-white p-7 sm:p-8 xl:border-l xl:border-t-0">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-secondary">
                      Phase One Often Includes
                    </p>
                    <ul className="mt-4 space-y-3 text-sm text-primary">
                      {pattern.firstPhase.map(item => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-1 h-2 w-2 rounded-full bg-black" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8">
                    <p className="text-xs uppercase tracking-[0.16em] text-secondary">
                      Usually Feels Better First
                    </p>
                    <ul className="mt-4 space-y-3 text-sm text-primary">
                      {pattern.improvesFirst.map(item => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-1 h-2 w-2 rounded-full bg-black" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 rounded-[22px] border border-black/8 bg-section-bg p-5">
                    <p className="text-xs uppercase tracking-[0.16em] text-secondary">
                      Best Fit When
                    </p>
                    <p className="mt-3 text-sm leading-7 text-primary">
                      {pattern.fit}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-[32px] border border-black/8 bg-black px-7 py-8 text-white sm:px-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                Start With The Pattern, Not A Perfect Spec
              </p>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                If one of these situations feels familiar, that is enough to begin.
              </h3>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/78 sm:text-base">
                You do not need polished requirements to start. The planner is there
                to turn one messy situation into a sensible first move.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <BriefLauncherButton
                label="Plan a similar setup"
                className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90"
              />
              <a
                href="#contact"
                className="inline-flex rounded-full border border-white/18 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/8"
              >
                Talk it through first
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
