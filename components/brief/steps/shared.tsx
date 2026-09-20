import type { ReactNode } from 'react'
import InlineDetails from '../../ui/InlineDetails'
import type {
  BriefUploadAsset,
  BriefUploadItemStatus,
  BriefUploadListItem,
  BriefFieldKey,
  BriefOptionItem,
  StepValidationResult,
} from '../../../lib/brief/types'

export function FieldGroup({
  title,
  children,
  detail,
  detailLabel,
}: {
  title: string
  children: ReactNode
  detail?: ReactNode
  detailLabel?: string
}) {
  return (
    <section className="space-y-4 rounded-[28px] border border-black/8 bg-section-bg/70 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-medium sm:text-lg">{title}</h3>
        {detail ? (
          <InlineDetails label={detailLabel ?? 'View details'} className="shrink-0">
            {detail}
          </InlineDetails>
        ) : null}
      </div>
      {children}
    </section>
  )
}

export function StepIssueList({
  validation,
}: {
  validation: StepValidationResult
}) {
  if (
    validation.blockingIssues.length === 0 &&
    validation.advisoryIssues.length === 0
  ) {
    return null
  }

  return (
    <div className="space-y-3">
      {validation.blockingIssues.map(issue => (
        <p
          key={`blocking-${issue.field}-${issue.message}`}
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {issue.message}
        </p>
      ))}
      {validation.advisoryIssues.length > 0 ? (
        <InlineDetails label="Why this can help">
          <div className="space-y-2">
            {validation.advisoryIssues.map(issue => (
              <p
                key={`advisory-${issue.field}-${issue.message}`}
                className="text-sm text-secondary"
              >
                {issue.message}
              </p>
            ))}
          </div>
        </InlineDetails>
      ) : null}
    </div>
  )
}

export function ChoiceCardGroup<T extends string>({
  value,
  options,
  onChange,
  hintMode = 'all',
}: {
  value: T | undefined
  options: BriefOptionItem<T>[]
  onChange: (value: T) => void
  hintMode?: 'all' | 'active' | 'hidden'
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map(item => {
        const active = item.key === value

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={`rounded-[24px] border p-4 text-left transition ${
              active
                ? 'border-black bg-black text-white'
                : 'border-black/10 bg-white hover:bg-black/3'
            }`}
          >
            <p className="font-medium">{item.label}</p>
            {item.hint && hintMode !== 'hidden' ? (
              <p className={`mt-2 text-sm ${active ? 'text-white/80' : 'text-secondary'}`}>
                {hintMode === 'active' && !active ? '' : item.hint}
              </p>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

export function SingleChoiceChipGroup<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T | undefined
  options: BriefOptionItem<T>[]
  onChange: (value: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map(item => {
        const active = item.key === value

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              active
                ? 'bg-black text-white'
                : 'border border-black/10 bg-white text-primary hover:bg-black/3'
            }`}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

export function MultiChoiceChipGroup<T extends string>({
  values,
  options,
  onChange,
}: {
  values: T[]
  options: BriefOptionItem<T>[]
  onChange: (values: T[]) => void
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map(item => {
        const active = values.includes(item.key)

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => {
              const nextValues = active
                ? values.filter(value => value !== item.key)
                : [...values, item.key]
              onChange(nextValues)
            }}
            className={`rounded-full px-4 py-2 text-sm transition ${
              active
                ? 'bg-black text-white'
                : 'border border-black/10 bg-white text-primary hover:bg-black/3'
            }`}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

export function BooleanCardGroup({
  value,
  trueLabel,
  falseLabel,
  onChange,
}: {
  value: boolean | undefined
  trueLabel: string
  falseLabel: string
  onChange: (value: boolean) => void
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`rounded-[24px] border p-4 text-left transition ${
          value === true
            ? 'border-black bg-black text-white'
            : 'border-black/10 bg-white hover:bg-black/3'
        }`}
      >
        {trueLabel}
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`rounded-[24px] border p-4 text-left transition ${
          value === false
            ? 'border-black bg-black text-white'
            : 'border-black/10 bg-white hover:bg-black/3'
        }`}
      >
        {falseLabel}
      </button>
    </div>
  )
}

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <input
        type={type}
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/30"
      />
    </label>
  )
}

export function TextAreaField({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <textarea
      value={value}
      onChange={event => onChange(event.target.value)}
      placeholder={placeholder}
      rows={6}
      className="w-full rounded-[24px] border border-black/10 bg-white px-4 py-4 text-sm outline-none transition focus:border-black/30"
    />
  )
}

export function LinkListEditor({
  values,
  onChange,
}: {
  values: string[]
  onChange: (values: string[]) => void
}) {
  const nextValues = [...values]
  while (nextValues.length < 3) {
    nextValues.push('')
  }

  return (
    <div className="space-y-3">
      {nextValues.map((value, index) => (
        <TextInput
          key={index}
          label={`Reference link ${index + 1}`}
          value={value}
          onChange={nextValue => {
            const updatedValues = [...nextValues]
            updatedValues[index] = nextValue
            onChange(updatedValues.filter(item => item.trim().length > 0))
          }}
          placeholder="https://"
        />
      ))}
    </div>
  )
}

export function UploadPlaceholder({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-[24px] border border-dashed border-black/15 bg-section-bg p-5">
      <p className="font-medium">{title}</p>
      <p className="mt-2 text-sm text-secondary">{description}</p>
    </div>
  )
}

export function UploadField({
  title,
  description,
  accept,
  multiple = false,
  items,
  isUploading = false,
  onSelectFiles,
  onRemoveAsset,
  onRetrySaveItem,
}: {
  title: string
  description: string
  accept?: string
  multiple?: boolean
  items: BriefUploadListItem[]
  isUploading?: boolean
  onSelectFiles?: (files: File[]) => Promise<void>
  onRemoveAsset?: (asset: BriefUploadAsset) => Promise<void>
  onRetrySaveItem?: (item: BriefUploadListItem) => Promise<void>
}) {
  return (
    <div className="rounded-[24px] border border-dashed border-black/15 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="font-medium">{title}</p>
          <p className="mt-2 text-sm text-secondary">{description}</p>
        </div>
        <label
          className={`inline-flex cursor-pointer rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-primary transition ${
            isUploading ? 'cursor-wait opacity-70' : 'hover:bg-black/3'
          }`}
        >
          <input
            type="file"
            className="sr-only"
            accept={accept}
            multiple={multiple}
            disabled={!onSelectFiles || isUploading}
            onChange={event => {
              const files = Array.from(event.target.files ?? [])
              event.currentTarget.value = ''
              if (files.length === 0 || !onSelectFiles) return
              void onSelectFiles(files)
            }}
          />
          {isUploading
            ? 'Uploading...'
            : multiple
              ? 'Choose files'
              : items.length > 0
                ? 'Replace file'
                : 'Choose file'}
        </label>
      </div>

      {items.length > 0 ? (
        <ul className="mt-4 space-y-2 text-sm text-secondary">
          {items.map(item => (
            <li
              key={item.uiId}
              className="rounded-2xl bg-white px-4 py-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {item.asset ? (
                    <a
                      href={item.asset.secureUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block truncate text-primary underline-offset-2 hover:underline"
                    >
                      {item.filename}
                    </a>
                  ) : (
                    <span className="block truncate text-primary">{item.filename}</span>
                  )}
                </div>
                <StatusPill status={item.status} />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {item.status === 'failed-save' && onRetrySaveItem ? (
                  <button
                    type="button"
                    onClick={() => {
                      void onRetrySaveItem(item)
                    }}
                    className="rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-primary transition hover:bg-black/3"
                  >
                    Retry Save
                  </button>
                ) : null}
                {item.asset && onRemoveAsset ? (
                  <button
                    type="button"
                    onClick={() => {
                      void onRemoveAsset(item.asset!)
                    }}
                    className="rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-primary transition hover:bg-black/3"
                  >
                    Remove
                  </button>
                ) : null}
              </div>

              {item.errorMessage ? (
                <p className="mt-2 text-xs text-red-700">{item.errorMessage}</p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

function StatusPill({
  status,
}: {
  status: BriefUploadItemStatus
}) {
  const styles =
    status === 'saved'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : status === 'uploading'
        ? 'border-black/10 bg-section-bg text-secondary'
        : status === 'pending-save'
          ? 'border-amber-200 bg-amber-50 text-amber-700'
          : 'border-red-200 bg-red-50 text-red-700'

  const label =
    status === 'saved'
      ? 'Saved'
      : status === 'uploading'
        ? 'Uploading'
        : status === 'pending-save'
          ? 'Saving...'
          : 'Save failed'

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${styles}`}>
      {label}
    </span>
  )
}

export function SummaryRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-[0.16em] text-secondary">{label}</p>
      <p className="text-sm text-primary">{value}</p>
    </div>
  )
}

export function collectFieldMessages(
  validation: StepValidationResult,
  field: BriefFieldKey,
): string[] {
  return [...validation.blockingIssues, ...validation.advisoryIssues]
    .filter(issue => issue.field === field)
    .map(issue => issue.message)
}
