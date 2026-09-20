import { NextResponse } from 'next/server'
import { coerceBriefStepId } from '../../../../lib/brief/branching'
import { deserializePersistablePatch } from '../../../../lib/brief/serializers'
import { saveDraft } from '../../../../lib/server/brief-repo'
import type {
  ApiErrorResponse,
  SaveDraftRequest,
  SaveDraftResponse,
} from '../../../../lib/brief/types'

function errorResponse(
  status: number,
  code: ApiErrorResponse['error']['code'],
  message: string,
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      ok: false,
      error: {
        code,
        message,
      },
    },
    { status },
  )
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<SaveDraftRequest>

    if (!body || typeof body !== 'object') {
      return errorResponse(400, 'VALIDATION_ERROR', 'Request body is required.')
    }

    if (!body.patch || typeof body.patch !== 'object') {
      return errorResponse(400, 'VALIDATION_ERROR', 'Draft patch is required.')
    }

    const currentStepId = coerceBriefStepId(body.currentStepId)
    const draft = await saveDraft({
      briefId: body.briefId,
      currentStepId,
      patch: deserializePersistablePatch(body.patch),
    })

    const response: SaveDraftResponse = {
      ok: true,
      briefId: draft.id!,
      status: 'draft',
      currentStepId: draft.currentStepId,
      completionPercent: draft.completionPercent,
      updatedAt: draft.updatedAt ?? new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    return errorResponse(
      500,
      'INTERNAL_ERROR',
      error instanceof Error ? error.message : 'Unable to save draft.',
    )
  }
}
