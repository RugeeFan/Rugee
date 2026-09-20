import { NextResponse } from 'next/server'
import { computeFrozenEstimateOnSubmit } from '../../../../lib/brief/estimator'
import { validateDraftForSubmit } from '../../../../lib/brief/branching'
import { createEmptyBriefDraft } from '../../../../lib/brief/defaults'
import { deserializePersistablePatch } from '../../../../lib/brief/serializers'
import { submitDraft } from '../../../../lib/server/brief-repo'
import type {
  ApiErrorResponse,
  BriefFieldErrorMap,
  ProjectBriefDraft,
  SubmitBriefRequest,
  SubmitBriefResponse,
} from '../../../../lib/brief/types'

function errorResponse(
  status: number,
  code: ApiErrorResponse['error']['code'],
  message: string,
  fieldErrors?: BriefFieldErrorMap,
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      ok: false,
      error: {
        code,
        message,
        fieldErrors,
      },
    },
    { status },
  )
}

function toFieldErrorMap(results: ReturnType<typeof validateDraftForSubmit>): BriefFieldErrorMap {
  return results.reduce<BriefFieldErrorMap>((accumulator, result) => {
    for (const issue of result.blockingIssues) {
      if (!accumulator[issue.field]) {
        accumulator[issue.field] = issue.message
      }
    }
    return accumulator
  }, {})
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<SubmitBriefRequest>

    if (!body || typeof body !== 'object' || !body.payload) {
      return errorResponse(400, 'VALIDATION_ERROR', 'A complete brief payload is required.')
    }

    const briefId = body.briefId ?? crypto.randomUUID()
    const payload = {
      ...createEmptyBriefDraft({
        id: briefId,
      }),
      ...deserializePersistablePatch(body.payload),
    } as ProjectBriefDraft

    const validationResults = validateDraftForSubmit(payload)
    const hasBlockingIssues = validationResults.some(result => !result.isValidForNext)

    if (hasBlockingIssues) {
      return errorResponse(
        400,
        'VALIDATION_ERROR',
        'Please complete the required fields before submitting.',
        toFieldErrorMap(validationResults),
      )
    }

    let estimateFrozen
    try {
      estimateFrozen = computeFrozenEstimateOnSubmit(payload)
    } catch (error) {
      return errorResponse(
        400,
        'ESTIMATE_ERROR',
        error instanceof Error ? error.message : 'Unable to compute estimate.',
      )
    }

    const submittedDraft = await submitDraft(briefId, {
      ...payload,
      estimateFrozen,
    })

    const response: SubmitBriefResponse = {
      ok: true,
      briefId: submittedDraft.id!,
      publicCode: submittedDraft.publicCode ?? 'BRF-MOCK',
      status: 'submitted',
      submittedAt: submittedDraft.submittedAt ?? new Date().toISOString(),
      estimate: estimateFrozen,
      successUrl: `/project-brief/success?brief=${submittedDraft.id}`,
    }

    return NextResponse.json(response)
  } catch (error) {
    return errorResponse(
      500,
      'INTERNAL_ERROR',
      error instanceof Error ? error.message : 'Unable to submit brief.',
    )
  }
}
