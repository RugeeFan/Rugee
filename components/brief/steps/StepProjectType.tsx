import type { BriefStepProps } from './types'
import {
  FieldGroup,
  ChoiceCardGroup,
  MultiChoiceChipGroup,
  SingleChoiceChipGroup,
  StepIssueList,
} from './shared'

export default function StepProjectType({
  draft,
  options,
  validation,
  onPatch,
}: BriefStepProps) {
  return (
    <div className="space-y-8">
      <FieldGroup
        title="What kind of help would make the biggest difference right now?"
        detailLabel="Need help choosing?"
        detail="Pick the closest fit, not the perfect label. If you are unsure, the planner will help narrow it down."
      >
        <ChoiceCardGroup
          value={draft.projectType}
          options={options.projectTypes}
          onChange={projectType => onPatch({ projectType })}
          hintMode="active"
        />
      </FieldGroup>

      {draft.projectType === 'unsure' ? (
        <>
          <FieldGroup title="What needs help first?">
            <SingleChoiceChipGroup
              value={draft.unsurePrimaryNeed}
              options={options.unsurePrimaryNeeds}
              onChange={unsurePrimaryNeed => onPatch({ unsurePrimaryNeed })}
            />
          </FieldGroup>

          <FieldGroup title="What already feels messy?">
            <MultiChoiceChipGroup
              values={draft.unsureNeeds}
              options={options.unsureNeeds}
              onChange={unsureNeeds => onPatch({ unsureNeeds })}
            />
          </FieldGroup>
        </>
      ) : null}

      <StepIssueList validation={validation} />
    </div>
  )
}
