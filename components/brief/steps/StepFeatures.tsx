import { getFeatureOptionsForResolvedType } from '../../../lib/brief/options'
import type { BriefStepProps } from './types'
import {
  ChoiceCardGroup,
  FieldGroup,
  MultiChoiceChipGroup,
  StepIssueList,
} from './shared'

export default function StepFeatures({
  draft,
  options,
  resolvedProjectType,
  validation,
  onPatch,
}: BriefStepProps) {
  const featureOptions = getFeatureOptionsForResolvedType(resolvedProjectType)

  return (
    <div className="space-y-8">
      {(resolvedProjectType === 'showcase' || resolvedProjectType === 'corporate') && (
        <FieldGroup title="How much information needs to be explained?">
          <ChoiceCardGroup
            value={draft.pageCountBand}
            options={options.pageCountBands}
            onChange={pageCountBand => onPatch({ pageCountBand })}
          />
        </FieldGroup>
      )}

      {resolvedProjectType === 'ecommerce' && (
        <FieldGroup title="How large is the store at launch?">
          <ChoiceCardGroup
            value={draft.catalogSizeBand}
            options={options.catalogSizeBands}
            onChange={catalogSizeBand => onPatch({ catalogSizeBand })}
          />
        </FieldGroup>
      )}

      {resolvedProjectType === 'system' && (
        <FieldGroup title="Who needs this workflow or system?">
          <ChoiceCardGroup
            value={draft.systemAudienceBand}
            options={options.systemAudienceBands}
            onChange={systemAudienceBand => onPatch({ systemAudienceBand })}
          />
        </FieldGroup>
      )}

      <FieldGroup
        title="What needs to happen in version one?"
        detailLabel="How to use this"
        detail="Choose the parts that matter on day one. You do not need to map the whole roadmap yet."
      >
        <MultiChoiceChipGroup
          values={draft.featureSelections}
          options={featureOptions}
          onChange={featureSelections => onPatch({ featureSelections })}
        />
      </FieldGroup>

      <FieldGroup title="How connected does this need to be?">
        <ChoiceCardGroup
          value={draft.integrationLevel}
          options={options.integrationLevels}
          onChange={integrationLevel => onPatch({ integrationLevel })}
          hintMode="active"
        />
      </FieldGroup>

      <StepIssueList validation={validation} />
    </div>
  )
}
