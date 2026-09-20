'use client'

import { useCallback, useState } from 'react'
import type {
  ApiErrorResponse,
  BriefUploadAsset,
  CloudinaryUploadApiResponse,
  UploadKind,
  UploadSignResponse,
} from '../lib/brief/types'

export interface UseDirectUploadResult {
  isUploading: boolean
  pendingUploadCount: number
  uploadError: string | null
  clearUploadError: () => void
  uploadFiles: (args: {
    kind: UploadKind
    files: File[]
    briefId?: string
  }) => Promise<BriefUploadAsset[]>
}

function toBriefUploadAsset(
  kind: UploadKind,
  file: File,
  response: CloudinaryUploadApiResponse,
): BriefUploadAsset {
  const inferredResourceType = file.type.startsWith('audio/')
    ? 'audio'
    : (response.resource_type ?? 'raw')

  return {
    id:
      response.asset_id ??
      (typeof crypto !== 'undefined' ? crypto.randomUUID() : `${Date.now()}-${file.name}`),
    kind,
    publicId: response.public_id,
    secureUrl: response.secure_url,
    resourceType: inferredResourceType,
    mimeType: file.type,
    originalFilename: file.name,
    bytes: response.bytes ?? file.size,
    durationSec:
      typeof response.duration === 'number'
        ? Math.round(response.duration)
        : undefined,
  }
}

export function useDirectUpload(): UseDirectUploadResult {
  const [pendingUploadCount, setPendingUploadCount] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const uploadFiles = useCallback(
    async ({
      kind,
      files,
      briefId,
    }: {
      kind: UploadKind
      files: File[]
      briefId?: string
    }): Promise<BriefUploadAsset[]> => {
      if (files.length === 0) {
        return []
      }

      setPendingUploadCount(currentCount => currentCount + 1)
      setUploadError(null)

      try {
        const uploadedAssets: BriefUploadAsset[] = []

        for (const file of files) {
          const signResponse = await fetch('/api/uploads/sign', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              briefId,
              kind,
              filename: file.name,
              mimeType: file.type,
              bytes: file.size,
            }),
          })

          if (!signResponse.ok) {
            const errorPayload = (await signResponse.json().catch(() => null)) as ApiErrorResponse | null
            throw new Error(
              errorPayload?.error.message ?? 'Unable to prepare your upload.',
            )
          }

          const signPayload = (await signResponse.json()) as UploadSignResponse
          const formData = new FormData()
          formData.append('file', file)
          formData.append('api_key', signPayload.upload.apiKey)
          formData.append('timestamp', String(signPayload.upload.timestamp))
          formData.append('signature', signPayload.upload.signature)
          formData.append('folder', signPayload.upload.folder)
          formData.append('public_id', signPayload.upload.publicId)

          const uploadResponse = await fetch(signPayload.upload.uploadUrl, {
            method: 'POST',
            body: formData,
          })

          const uploadPayload = (await uploadResponse.json().catch(() => null)) as
            | (CloudinaryUploadApiResponse & { error?: { message?: string } })
            | null

          if (!uploadResponse.ok || !uploadPayload?.secure_url || !uploadPayload.public_id) {
            throw new Error(
              uploadPayload?.error?.message ?? 'Unable to upload your file right now.',
            )
          }

          uploadedAssets.push(toBriefUploadAsset(kind, file, uploadPayload))
        }

        return uploadedAssets
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Unable to upload your file right now.'
        setUploadError(message)
        throw new Error(message)
      } finally {
        setPendingUploadCount(currentCount => Math.max(0, currentCount - 1))
      }
    },
    [],
  )

  return {
    isUploading: pendingUploadCount > 0,
    pendingUploadCount,
    uploadError,
    clearUploadError: useCallback(() => {
      setUploadError(null)
    }, []),
    uploadFiles,
  }
}
