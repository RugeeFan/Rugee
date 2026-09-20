import type { BriefStepProps } from './types'
import InlineDetails from '../../ui/InlineDetails'
import {
  FieldGroup,
  SingleChoiceChipGroup,
  StepIssueList,
  TextAreaField,
  TextInput,
  UploadField,
} from './shared'
import VoiceRecorderCard from './VoiceRecorderCard'

export default function StepContactSubmit({
  draft,
  options,
  validation,
  onPatch,
  isUploading,
  pendingUploadCount,
  uploadItems,
  submitGuardMessage,
  onUploadFiles,
  onRemoveUpload,
  onRetryUploadSave,
}: BriefStepProps) {
  return (
    <div className="space-y-8">
      <FieldGroup title="Best way to follow up">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Name"
            value={draft.contactName ?? ''}
            onChange={contactName => onPatch({ contactName })}
            placeholder="Your name"
          />
          <TextInput
            label="Email"
            type="email"
            value={draft.contactEmail ?? ''}
            onChange={contactEmail => onPatch({ contactEmail })}
            placeholder="name@example.com"
          />
          <TextInput
            label="WhatsApp or phone"
            value={draft.contactPhone ?? ''}
            onChange={contactPhone => onPatch({ contactPhone })}
            placeholder="+61..."
          />
          <TextInput
            label="Company"
            value={draft.companyName ?? ''}
            onChange={companyName => onPatch({ companyName })}
            placeholder="Company name"
          />
        </div>
      </FieldGroup>

      <FieldGroup title="How would you like me to reply?">
        <SingleChoiceChipGroup
          value={draft.preferredContactMethod}
          options={options.preferredContactMethods}
          onChange={preferredContactMethod => onPatch({ preferredContactMethod })}
        />
      </FieldGroup>

      <label className="flex items-start gap-3 rounded-2xl border border-black/8 p-4 text-sm text-secondary">
        <input
          type="checkbox"
          checked={Boolean(draft.consentToFollowUp)}
          onChange={event => onPatch({ consentToFollowUp: event.target.checked })}
          className="mt-0.5 h-4 w-4 rounded border-black/20"
        />
        <span>I agree that you can contact me about this project planner submission.</span>
      </label>

      <InlineDetails label="Add more context or files (optional)">
        <div className="space-y-6">
          <FieldGroup title="Anything else I should know about the bottleneck or business?">
            <TextAreaField
              value={draft.additionalNotes ?? ''}
              onChange={additionalNotes => onPatch({ additionalNotes })}
              placeholder="Add context, constraints, repeated problems, or questions."
            />
          </FieldGroup>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <VoiceRecorderCard
                isBusy={isUploading}
                onRecordReady={file => onUploadFiles?.('voice_note', [file]) ?? Promise.resolve()}
              />
              <UploadField
                title="Voice note upload"
                description="You can also upload an existing audio file if talking is easier."
                accept="audio/*"
                items={uploadItems?.voice_note ?? []}
                isUploading={isUploading}
                onSelectFiles={files => onUploadFiles?.('voice_note', files.slice(0, 1)) ?? Promise.resolve()}
                onRemoveAsset={asset => onRemoveUpload?.('voice_note', asset) ?? Promise.resolve()}
                onRetrySaveItem={item => onRetryUploadSave?.('voice_note', item) ?? Promise.resolve()}
              />
            </div>
            <UploadField
              title="Extra files"
              description="Add briefs, screenshots, exports, PDFs, or sample files."
              accept="image/*,.pdf,.doc,.docx,audio/*,video/*"
              multiple
              items={uploadItems?.additional_file ?? []}
              isUploading={isUploading}
              onSelectFiles={files => onUploadFiles?.('additional_file', files) ?? Promise.resolve()}
              onRemoveAsset={asset => onRemoveUpload?.('additional_file', asset) ?? Promise.resolve()}
              onRetrySaveItem={item => onRetryUploadSave?.('additional_file', item) ?? Promise.resolve()}
            />
          </div>
        </div>
      </InlineDetails>

      {submitGuardMessage ? (
        <p className="rounded-2xl border border-black/8 bg-section-bg px-4 py-3 text-sm text-secondary">
          {submitGuardMessage}
        </p>
      ) : pendingUploadCount && pendingUploadCount > 0 ? (
        <p className="rounded-2xl border border-black/8 bg-section-bg px-4 py-3 text-sm text-secondary">
          Please wait for the current upload to finish before submitting your brief.
        </p>
      ) : null}

      <StepIssueList validation={validation} />
    </div>
  )
}
