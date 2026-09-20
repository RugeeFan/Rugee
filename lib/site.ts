export const SITE_NAME = 'Rugee'

export const SITE_DESCRIPTION =
  'Websites and lightweight business systems for growing small businesses that want less manual work and simpler operations.'

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
