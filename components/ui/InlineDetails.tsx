import type { ReactNode } from 'react'

type InlineDetailsProps = {
  label?: string
  children: ReactNode
  className?: string
}

export default function InlineDetails({
  label = 'View details',
  children,
  className = '',
}: InlineDetailsProps) {
  return (
    <details className={`group ${className}`}>
      <summary className="cursor-pointer list-none text-sm font-medium text-secondary transition hover:text-primary">
        <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5">
          {label}
          <span className="transition group-open:rotate-45">+</span>
        </span>
      </summary>
      <div className="mt-3 rounded-[20px] border border-black/8 bg-section-bg px-4 py-4 text-sm leading-7 text-secondary">
        {children}
      </div>
    </details>
  )
}
