import { createHash } from 'node:crypto'
import type {
  UploadKind,
  UploadSignRequest,
  UploadSignResponse,
} from '../brief/types'

const MAX_FILE_BYTES = 25 * 1024 * 1024

const ALLOWED_KINDS = [
  'reference_asset',
  'additional_file',
  'voice_note',
] as const satisfies UploadKind[]

const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'audio/mpeg',
  'audio/mp4',
  'audio/webm',
  'audio/wav',
  'audio/ogg',
  'video/mp4',
  'video/quicktime',
  'video/webm',
] as const

type UploadValidationErrorCode =
  | 'UPLOAD_NOT_ALLOWED'
  | 'FILE_TOO_LARGE'
  | 'UNSUPPORTED_TYPE'

interface CloudinaryEnvironment {
  cloudName: string
  apiKey: string
  apiSecret: string
}

export function validateUploadRequest(
  request: UploadSignRequest,
): { ok: true } | { ok: false; code: UploadValidationErrorCode; message: string } {
  if (!ALLOWED_KINDS.includes(request.kind)) {
    return {
      ok: false,
      code: 'UPLOAD_NOT_ALLOWED',
      message: 'This upload type is not allowed.',
    }
  }

  if (!request.filename.trim() || !request.mimeType.trim()) {
    return {
      ok: false,
      code: 'UPLOAD_NOT_ALLOWED',
      message: 'Filename and mime type are required.',
    }
  }

  if (request.bytes <= 0 || request.bytes > MAX_FILE_BYTES) {
    return {
      ok: false,
      code: 'FILE_TOO_LARGE',
      message: 'The selected file exceeds the current 25 MB size limit.',
    }
  }

  if (!ALLOWED_MIME_TYPES.includes(request.mimeType as (typeof ALLOWED_MIME_TYPES)[number])) {
    return {
      ok: false,
      code: 'UNSUPPORTED_TYPE',
      message: 'This file type is not supported yet.',
    }
  }

  return { ok: true }
}

export function getCloudinaryEnvironment(): CloudinaryEnvironment {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim()
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim()
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim()

  const missing = [
    !cloudName ? 'CLOUDINARY_CLOUD_NAME' : null,
    !apiKey ? 'CLOUDINARY_API_KEY' : null,
    !apiSecret ? 'CLOUDINARY_API_SECRET' : null,
  ].filter(Boolean)

  if (missing.length > 0) {
    throw new Error(
      `Cloudinary upload signing is not configured. Missing ${missing.join(', ')}.`,
    )
  }

  return {
    cloudName: cloudName!,
    apiKey: apiKey!,
    apiSecret: apiSecret!,
  }
}

function sanitizeSegment(value: string): string {
  const normalized = value
    .toLowerCase()
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return normalized || 'file'
}

function buildSignature(
  params: Record<string, string | number>,
  apiSecret: string,
): string {
  const serialized = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  return createHash('sha1')
    .update(`${serialized}${apiSecret}`)
    .digest('hex')
}

function resolveFolder(kind: UploadKind, briefId?: string): string {
  return `project-brief/${kind}/${sanitizeSegment(briefId ?? 'unassigned')}`
}

export function createUploadSignature(
  request: UploadSignRequest,
): UploadSignResponse {
  const environment = getCloudinaryEnvironment()
  const timestamp = Math.floor(Date.now() / 1000)
  const folder = resolveFolder(request.kind, request.briefId)
  const publicId = `${sanitizeSegment(request.filename)}-${timestamp}`
  const signature = buildSignature(
    {
      folder,
      public_id: publicId,
      timestamp,
    },
    environment.apiSecret,
  )

  return {
    ok: true,
    upload: {
      cloudName: environment.cloudName,
      apiKey: environment.apiKey,
      timestamp,
      signature,
      folder,
      publicId,
      resourceType: 'auto',
      uploadUrl: `https://api.cloudinary.com/v1_1/${environment.cloudName}/auto/upload`,
    },
  }
}
