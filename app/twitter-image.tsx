import { ImageResponse } from 'next/og'
import { SITE_NAME } from '../lib/site'

export const runtime = 'edge'
export const alt = `${SITE_NAME} twitter preview image`
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          background: '#f7f5ef',
          color: '#121212',
          padding: '56px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '32px',
            background: '#ffffff',
            padding: '48px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '880px' }}>
            <div
              style={{
                fontSize: 24,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: '#5c5c5c',
              }}
            >
              Business project planner
            </div>
            <div
              style={{
                fontSize: 74,
                lineHeight: 1.02,
                fontWeight: 700,
                letterSpacing: '-0.06em',
              }}
            >
              Simplify the work behind the business.
            </div>
            <div
              style={{
                fontSize: 30,
                lineHeight: 1.45,
                color: '#4f4f4f',
                maxWidth: '840px',
              }}
            >
              Ruijie (Rugee) Fan — TypeScript, React, Node and PostgreSQL, from database schema to deployment.
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '999px',
                padding: '12px 20px',
                fontSize: 24,
              }}
            >
              Start with the bottleneck
            </div>
            <div style={{ fontSize: 34, fontWeight: 700 }}>{SITE_NAME}</div>
          </div>
        </div>
      </div>
    ),
    size,
  )
}
