import type { Metadata } from 'next'
import AnalyticsScripts from '../components/analytics/AnalyticsScripts'
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, getSiteUrl } from '../lib/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  keywords: [
    'small business website',
    'business workflow system',
    'operations automation',
    'custom business system',
    'lead generation website',
    'small business process improvement',
  ],
  category: 'business',
  openGraph: {
    title: SITE_NAME,
    description: SITE_TAGLINE,
    url: '/',
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_AU',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} preview image`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_TAGLINE,
    images: ['/twitter-image'],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      }
    : undefined,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans bg-white text-primary antialiased">
        <AnalyticsScripts />
        {children}
      </body>
    </html>
  )
}
