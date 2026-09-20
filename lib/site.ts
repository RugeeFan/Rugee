export const SITE_NAME = 'Rugee'

export const SITE_DESCRIPTION =
  'Ruijie (Rugee) Fan — full-stack developer in Sydney. I build software small businesses actually run on: TypeScript, React, Node and PostgreSQL, from schema to deployment.'

export const SITE_TAGLINE =
  'Clearer websites and lightweight systems that help small businesses reduce repeated admin and run more clearly.'

export const CONTACT_EMAIL = 'Rugee.coder@gmail.com'
export const CONTACT_PHONE = '+61449963099'
export const WHATSAPP_URL = 'https://wa.me/61449963099'

export function getSiteUrl(): URL {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3001')

  try {
    return new URL(siteUrl)
  } catch {
    return new URL('http://localhost:3001')
  }
}

export function absoluteUrl(path = '/'): string {
  return new URL(path, getSiteUrl()).toString()
}
