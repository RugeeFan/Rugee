import { NextResponse } from 'next/server'
import { createUploadSignature, validateUploadRequest } from '../../../../lib/cloudinary/sign-upload'
import type {
  ApiErrorResponse,
  UploadSignRequest,
  UploadSignResponse,
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
    const body = (await request.json()) as Partial<UploadSignRequest>

    if (
      !body ||
      typeof body !== 'object' ||
      !body.kind ||
      !body.filename ||
      !body.mimeType ||
      typeof body.bytes !== 'number'
    ) {
      return errorResponse(400, 'VALIDATION_ERROR', 'Upload signing payload is incomplete.')
    }

    const validationResult = validateUploadRequest({
      briefId: body.briefId,
      kind: body.kind,
      filename: body.filename,
      mimeType: body.mimeType,
      bytes: body.bytes,
    })

    if (!validationResult.ok) {
      const status =
        validationResult.code === 'FILE_TOO_LARGE'
          ? 413
          : validationResult.code === 'UNSUPPORTED_TYPE'
            ? 415
            : 400

      return errorResponse(status, validationResult.code, validationResult.message)
    }

    const response: UploadSignResponse = createUploadSignature({
      briefId: body.briefId,
      kind: body.kind,
      filename: body.filename,
      mimeType: body.mimeType,
      bytes: body.bytes,
    })

    return NextResponse.json(response)
  } catch (error) {
    return errorResponse(
      500,
      'INTERNAL_ERROR',
      error instanceof Error ? error.message : 'Unable to create upload signature.',
    )
  }
}
