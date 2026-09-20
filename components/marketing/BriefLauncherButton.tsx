'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { trackEvent } from '../../lib/analytics'
import type { ProjectTypeKey } from '../../lib/brief/types'

type BriefLauncherButtonProps = {
  label?: string
  className?: string
  projectType?: ProjectTypeKey
}

declare global {
  interface WindowEventMap {
    'open-brief': CustomEvent<{ projectType?: ProjectTypeKey }>
  }
}

export default function BriefLauncherButton({
  label = 'Start Your Project Brief',
  className,
  projectType,
}: BriefLauncherButtonProps) {
  const router = useRouter()
  const baseButtonClassName = useMemo(
    () =>
      className ??
      'inline-flex rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-black/85',
    [className],
  )

  return (
    <button
      type="button"
      onClick={() => {
        const params = new URLSearchParams()
        if (projectType) {
          params.set('type', projectType)
        }

        const opensAsPage = window.matchMedia('(max-width: 767px)').matches
        trackEvent('planner_cta_clicked', {
          label,
          project_type: projectType ?? 'unspecified',
          destination: opensAsPage ? 'page' : 'modal',
        })

        if (opensAsPage) {
          router.push(`/project-brief${params.toString() ? `?${params.toString()}` : ''}`)
          return
        }

        window.dispatchEvent(
          new CustomEvent('open-brief', {
            detail: {
              projectType,
            },
          }),
        )
      }}
      className={baseButtonClassName}
    >
      {label}
    </button>
  )
}
