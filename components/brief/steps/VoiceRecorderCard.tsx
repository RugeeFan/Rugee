'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type VoiceRecorderCardProps = {
  isBusy?: boolean
  onRecordReady?: (file: File) => Promise<void>
}

export default function VoiceRecorderCard({
  isBusy = false,
  onRecordReady,
}: VoiceRecorderCardProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingError, setRecordingError] = useState<string | null>(null)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<BlobPart[]>([])

  const previewUrl = useMemo(
    () => (recordedBlob ? URL.createObjectURL(recordedBlob) : null),
    [recordedBlob],
  )

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }

      streamRef.current?.getTracks().forEach(track => track.stop())
    }
  }, [previewUrl])

  async function handleStartRecording() {
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === 'undefined'
    ) {
      setRecordingError('Voice recording is not supported in this browser. You can still upload an audio file instead.')
      return
    }

    try {
      setRecordingError(null)
      setRecordedBlob(null)
      chunksRef.current = []

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = event => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setRecordedBlob(blob)
        stream.getTracks().forEach(track => track.stop())
        streamRef.current = null
        setIsRecording(false)
      }

      recorder.start()
      setIsRecording(true)
    } catch (error) {
      setRecordingError(
        error instanceof Error
          ? error.message
          : 'Could not access your microphone.',
      )
    }
  }

  function handleStopRecording() {
    mediaRecorderRef.current?.stop()
  }

  async function handleUseRecording() {
    if (!recordedBlob || !onRecordReady) {
      return
    }

    const file = new File(
      [recordedBlob],
      `voice-note-${new Date().toISOString().replace(/[:.]/g, '-')}.webm`,
      { type: 'audio/webm' },
    )

    await onRecordReady(file)
    setRecordedBlob(null)
  }

  return (
    <div className="rounded-[24px] border border-black/8 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-medium text-primary">Record a voice note</p>
          <p className="mt-2 text-sm text-secondary">
            If speaking is easier than typing, record a quick note and attach it to the brief.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!isRecording ? (
            <button
              type="button"
              onClick={() => {
                void handleStartRecording()
              }}
              disabled={isBusy}
              className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-primary transition hover:bg-black/3 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Start recording
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStopRecording}
              className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/85"
            >
              Stop recording
            </button>
          )}

          {recordedBlob ? (
            <button
              type="button"
              onClick={() => {
                void handleUseRecording()
              }}
              disabled={isBusy}
              className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-primary transition hover:bg-black/3 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Use this recording
            </button>
          ) : null}
        </div>
      </div>

      {isRecording ? (
        <p className="mt-4 text-sm text-secondary">Recording in progress...</p>
      ) : null}

      {previewUrl ? (
        <audio controls src={previewUrl} className="mt-4 w-full" />
      ) : null}

      {recordingError ? (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {recordingError}
        </p>
      ) : null}
    </div>
  )
}
