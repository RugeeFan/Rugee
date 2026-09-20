import type { BriefStepProps } from './types'
import InlineDetails from '../../ui/InlineDetails'
import {
  ChoiceCardGroup,
  FieldGroup,
  LinkListEditor,
  SingleChoiceChipGroup,
  StepIssueList,
  UploadField,
} from './shared'

export default function StepDesign({
  draft,
  options,
  validation,
  onPatch,
  isUploading,
  uploadItems,
  onUploadFiles,
  onRemoveUpload,
  onRetryUploadSave,
}: BriefStepProps) {
  return (
    <div className="space-y-8">
      <FieldGroup
        title="What kind of first impression should this create?"
        detailLabel="Need examples?"
        detail="Choose the feeling that is closest. You can add references below if that is easier than describing it."
      >
        <ChoiceCardGroup
          value={draft.styleDirection}
          options={options.styleDirections}
          onChange={styleDirection => onPatch({ styleDirection })}
          hintMode="active"
        />
      </FieldGroup>

      <FieldGroup title="Colour direction">
        <SingleChoiceChipGroup
          value={draft.colorDirection}
          options={options.colorDirections}
          onChange={colorDirection => onPatch({ colorDirection })}
        />
      </FieldGroup>

      <FieldGroup title="How polished or lively should it feel?">
        <ChoiceCardGroup
          value={draft.motionLevel}
          options={options.motionLevels}
          onChange={motionLevel => onPatch({ motionLevel })}
          hintMode="active"
        />
      </FieldGroup>

      <InlineDetails label="Add references or visual material">
        <div className="space-y-6">
          <FieldGroup title="Reference links">
            <LinkListEditor
              values={draft.referenceLinks}
              onChange={referenceLinks => onPatch({ referenceLinks })}
            />
          </FieldGroup>

          <FieldGroup title="Upload inspiration">
            <UploadField
              title="Reference uploads"
              description="Upload screenshots, brand assets, wireframes, or anything that shows the direction."
              accept="image/*,.pdf,.doc,.docx"
              multiple
              items={uploadItems?.reference_asset ?? []}
              isUploading={isUploading}
              onSelectFiles={files => onUploadFiles?.('reference_asset', files) ?? Promise.resolve()}
              onRemoveAsset={asset => onRemoveUpload?.('reference_asset', asset) ?? Promise.resolve()}
              onRetrySaveItem={item => onRetryUploadSave?.('reference_asset', item) ?? Promise.resolve()}
            />
          </FieldGroup>
        </div>
      </InlineDetails>

      <StepIssueList validation={validation} />
    </div>
  )
}
