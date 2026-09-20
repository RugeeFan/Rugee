import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createEmptyBriefDraft } from '../brief/defaults'
import { patchDraftState, sanitizeDraftForBranching } from '../brief/branching'
import type {
  BriefDraftPatch,
  BriefStepId,
  ProjectBriefDraft,
} from '../brief/types'

interface BriefStoreFile {
  briefs: Record<string, ProjectBriefDraft>
}

const STORE_DIRECTORY = path.join(process.cwd(), '.dev-data')
const STORE_FILE_PATH = path.join(STORE_DIRECTORY, 'project-briefs.json')

function createId() {
  return crypto.randomUUID()
}

function createPublicCode() {
  return `BRF-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}

async function ensureStoreFile(): Promise<void> {
  await mkdir(STORE_DIRECTORY, { recursive: true })

  try {
    await readFile(STORE_FILE_PATH, 'utf8')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error
    }

    const emptyStore: BriefStoreFile = { briefs: {} }
    await writeFile(STORE_FILE_PATH, JSON.stringify(emptyStore, null, 2), 'utf8')
  }
}

async function readStore(): Promise<BriefStoreFile> {
  await ensureStoreFile()

  try {
    const raw = await readFile(STORE_FILE_PATH, 'utf8')
    const parsed = JSON.parse(raw) as Partial<BriefStoreFile>

    return {
      briefs: parsed.briefs ?? {},
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return { briefs: {} }
    }

    throw error
  }
}

async function writeStore(store: BriefStoreFile): Promise<void> {
  await ensureStoreFile()
  await writeFile(STORE_FILE_PATH, JSON.stringify(store, null, 2), 'utf8')
}

export async function getBriefById(id: string): Promise<ProjectBriefDraft | null> {
  const store = await readStore()
  return store.briefs[id] ?? null
}

export async function saveDraft(
  request: {
    briefId?: string
    currentStepId: BriefStepId
    patch: BriefDraftPatch
  },
): Promise<ProjectBriefDraft> {
  const now = new Date().toISOString()
  const briefId = request.briefId ?? createId()
  const store = await readStore()
  const existingDraft =
    store.briefs[briefId] ??
    createEmptyBriefDraft({
      id: briefId,
      publicCode: createPublicCode(),
      createdAt: now,
    })

  const nextDraft = patchDraftState(existingDraft, {
    ...request.patch,
    id: briefId,
    currentStepId: request.currentStepId,
    updatedAt: now,
  })

  store.briefs[briefId] = nextDraft
  await writeStore(store)

  return nextDraft
}

export async function submitDraft(
  briefId: string,
  payload: ProjectBriefDraft,
): Promise<ProjectBriefDraft> {
  const now = new Date().toISOString()
  const store = await readStore()
  const existingDraft = store.briefs[briefId]

  const nextDraft = sanitizeDraftForBranching({
    ...(existingDraft ?? createEmptyBriefDraft({ id: briefId, publicCode: createPublicCode() })),
    ...payload,
    id: briefId,
    status: 'submitted',
    submittedAt: now,
    updatedAt: now,
  })

  store.briefs[briefId] = nextDraft
  await writeStore(store)

  return nextDraft
}

export async function getSubmittedBriefById(
  id: string,
): Promise<ProjectBriefDraft | null> {
  const brief = await getBriefById(id)
  if (!brief || brief.status !== 'submitted') {
    return null
  }

  return brief
}
