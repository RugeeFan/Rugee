'use client'

import { useState } from 'react'

type CopyEmailProps = { email: string; copyLabel: string; copiedLabel: string }

export default function CopyEmail({ email, copyLabel, copiedLabel }: CopyEmailProps) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email)
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1800)
        } catch {
          window.location.href = `mailto:${email}`
        }
      }}
      className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white/80 transition hover:border-white/50 hover:text-white"
      aria-live="polite"
    >
      <span className={`h-1.5 w-1.5 rounded-full transition ${copied ? 'bg-emerald-400' : 'bg-white/40'}`} />
      {copied ? copiedLabel : copyLabel}
    </button>
  )
}
