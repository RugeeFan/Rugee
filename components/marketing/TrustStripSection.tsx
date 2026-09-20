import SectionHeading from './SectionHeading'

const trustItems = [
  'Direct collaboration',
  'Website + workflow thinking',
  'No technical spec needed',
  'Can start with one workflow',
  'Phased delivery',
  'Reply target: 24h',
]

export default function TrustStripSection() {
  return (
    <section className="border-y border-black/6 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Built For Growing Businesses"
          title="Clearer operations, not more software for the sake of it."
          description="The goal is to remove repeated admin, tighten follow-up, and make everyday work easier to manage without turning the project into something oversized."
        />

        <div className="mt-10 flex flex-wrap gap-3">
          {trustItems.map(item => (
            <span
              key={item}
              className="rounded-full border border-black/10 bg-section-bg px-4 py-2 text-sm text-primary"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
