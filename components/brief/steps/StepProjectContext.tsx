import type { BriefStepProps } from './types'
import {
  ChoiceCardGroup,
  FieldGroup,
  MultiChoiceChipGroup,
  SingleChoiceChipGroup,
  StepIssueList,
} from './shared'

export default function StepProjectContext({
  draft,
  options,
  validation,
  onPatch,
}: BriefStepProps) {
  return (
    <div className="space-y-8">
      <FieldGroup title="What kind of business is this?">
        <SingleChoiceChipGroup
          value={draft.industry}
          options={options.industries}
          onChange={industry => onPatch({ industry })}
        />
      </FieldGroup>

      <FieldGroup
        title="What do you most want to improve?"
        detailLabel="Why this matters"
        detail="This helps shape the work around the real business outcome, not just the visible deliverable."
      >
        <MultiChoiceChipGroup
          values={draft.businessGoals}
          options={options.businessGoals}
          onChange={businessGoals => onPatch({ businessGoals })}
        />
      </FieldGroup>

      <FieldGroup title="What are you already working with?">
        <ChoiceCardGroup
          value={draft.currentPresence}
          options={options.currentPresences}
          onChange={currentPresence => onPatch({ currentPresence })}
          hintMode="active"
        />
      </FieldGroup>

      <FieldGroup title="How much of this is new versus existing?">
        <ChoiceCardGroup
          value={draft.buildScope}
          options={options.buildScopes}
          onChange={buildScope => onPatch({ buildScope })}
          hintMode="active"
        />
      </FieldGroup>

      <FieldGroup title="How ready is the current content or business material?">
        <ChoiceCardGroup
          value={draft.contentReadiness}
          options={options.contentReadinessOptions}
          onChange={contentReadiness => onPatch({ contentReadiness })}
          hintMode="active"
        />
      </FieldGroup>

      <StepIssueList validation={validation} />
    </div>
  )
}
