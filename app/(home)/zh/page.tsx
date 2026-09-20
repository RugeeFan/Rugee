import type { Metadata } from 'next'
import HomePage from '../../../components/home/HomePage'
import PersonStructuredData from '../../../components/home/PersonStructuredData'
import { createPageMetadata } from '../../../lib/metadata'

export const metadata: Metadata = {
  ...createPageMetadata({
    title: 'Ruijie (Rugee) Fan — 全栈开发者 · 悉尼',
    description: '悉尼全栈开发者。我写的软件，是小生意每天真正在用的——TypeScript、React、Node、PostgreSQL，从数据库设计到上线部署。',
    path: '/zh',
  }),
  title: { absolute: 'Ruijie (Rugee) Fan — 全栈开发者 · 悉尼' },
  alternates: { canonical: '/zh', languages: { en: '/', 'zh-Hans': '/zh' } },
}

export default function HomeZh() {
  return (
    <>
      <PersonStructuredData />
      <HomePage locale="zh" />
    </>
  )
}
