import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import HomePage from '../../components/home/HomePage'
import PersonStructuredData from '../../components/home/PersonStructuredData'
import { createPageMetadata } from '../../lib/metadata'

export const metadata: Metadata = {
  ...createPageMetadata({
    title: 'Ruijie (Rugee) Fan — Full-Stack Developer in Sydney',
    description:
      'Full-stack developer in Sydney. I build software small businesses actually run on — TypeScript, React, Node and PostgreSQL, from schema to deployment.',
    path: '/',
  }),
  title: { absolute: 'Ruijie (Rugee) Fan — Full-Stack Developer in Sydney' },
  alternates: { canonical: '/', languages: { en: '/', 'zh-Hans': '/zh' } },
}

type HomeProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

// The client-brief planner used to live at "/". Old links (?draft=…, ?brief=open, ?type=…)
// are forwarded to its new home so saved drafts keep working.
export default async function Home({ searchParams }: HomeProps) {
  const params = (await searchParams) ?? {}
  if (params.draft || params.brief || params.type) {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (typeof value === 'string') query.set(key, value)
    })
    redirect(`/studio?${query.toString()}`)
  }

  return (
    <>
      <PersonStructuredData />
      <HomePage locale="en" />
    </>
  )
}
