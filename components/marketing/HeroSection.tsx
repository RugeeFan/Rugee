import BriefLauncherButton from './BriefLauncherButton'

const focusAreas = [
  'Leads and requests stop getting lost between channels.',
  'Quotes, bookings, and approvals get a clearer workflow.',
  'Repeated admin starts shrinking instead of growing with the business.',
  'You work directly with the person shaping and building the solution.',
]

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-section-bg">
      <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.06),transparent_50%)]" />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_420px] lg:px-8 lg:py-28">
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[0.24em] text-secondary">
            Websites And Lightweight Systems
          </p>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Less manual work
            <br />
            for growing businesses.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-secondary">
            I build clearer websites and lightweight business systems for small
            teams that are tired of chasing leads, repeating admin, and holding
            the whole process together by memory.
          </p>
          <p className="mt-3 max-w-xl text-base text-secondary">
            If you know the business feels messier than it should, the planner
            helps turn that into a simple starting scope.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <BriefLauncherButton label="Start the 5-minute planner" />
            <a
              href="#outcomes"
              className="inline-flex rounded-full border border-black/10 px-6 py-3 text-sm font-medium text-primary transition hover:bg-black/3"
            >
              See what gets simpler
            </a>
          </div>
        </div>

        <div className="relative z-10">
          <div className="rounded-[32px] border border-black/8 bg-white p-6 shadow-[0_20px_80px_rgba(0,0,0,0.05)]">
            <div className="relative">
              <img
                src="https://res.cloudinary.com/djwau0xeb/image/upload/v1/avatar_tsepok"
                alt="Rugee portrait"
                className="h-24 w-24 rounded-full object-cover"
              />
              <span className="absolute left-20 top-8 rounded-full border border-black/8 bg-section-bg px-4 py-2 text-sm font-medium shadow-sm">
                Rugee
              </span>
            </div>

            <div className="mt-8 rounded-[24px] border border-black/8 bg-section-bg p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-secondary">
                What Usually Starts To Hurt
              </p>
              <ul className="mt-4 space-y-3 text-sm text-primary">
                {focusAreas.map(area => (
                  <li key={area} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-black" />
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[24px] border border-black/8 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-secondary">
                  Best Fit
                </p>
                <p className="mt-3 text-sm text-primary">
                  Growing small businesses that are feeling the cost of repeated admin.
                </p>
              </div>
              <div className="rounded-[24px] border border-black/8 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-secondary">
                  Start With
                </p>
                <p className="mt-3 text-sm text-primary">
                  One useful workflow, one clearer website path, or one messy bottleneck.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
