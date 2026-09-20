import type { BriefStepProps } from './types'
import {
  BooleanCardGroup,
  ChoiceCardGroup,
  FieldGroup,
  StepIssueList,
} from './shared'

export default function StepBudgetTimeline({
  draft,
  options,
  validation,
  onPatch,
}: BriefStepProps) {
  return (
    <div className="space-y-8">
      <FieldGroup
        title="Budget direction"
        detailLabel="How I use this"
        detail="This helps me recommend the right size of first phase. It does not lock you into a final quote."
      >
        <ChoiceCardGroup
          value={draft.budgetBand}
          options={options.budgetBands}
          onChange={budgetBand => onPatch({ budgetBand })}
        />
      </FieldGroup>

      <FieldGroup title="When would you like the pressure to ease?">
        <ChoiceCardGroup
          value={draft.launchWindow}
          options={options.launchWindows}
          onChange={launchWindow => onPatch({ launchWindow })}
          hintMode="active"
        />
      </FieldGroup>

      <FieldGroup title="Would a staged rollout help?">
        <BooleanCardGroup
          value={draft.phasedDelivery}
          trueLabel="Yes, start with the most useful part first"
          falseLabel="No, I would rather launch the whole thing together"
          onChange={phasedDelivery => onPatch({ phasedDelivery })}
        />
      </FieldGroup>

      <FieldGroup title="Do you want help shaping the best starting plan?">
        <BooleanCardGroup
          value={draft.needsDiscoverySupport}
          trueLabel="Yes, I want help narrowing the right approach"
          falseLabel="No, the direction is already fairly clear"
          onChange={needsDiscoverySupport => onPatch({ needsDiscoverySupport })}
        />
      </FieldGroup>

      <StepIssueList validation={validation} />
    </div>
  )
}
