import { ImageResponse } from 'next/og'
import { SITE_DESCRIPTION, SITE_NAME } from '../lib/site'

export const runtime = 'edge'
export const alt = `${SITE_NAME} preview image`
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          background: 'linear-gradient(135deg, #faf9f6 0%, #f1efea 100%)',
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
            background: 'rgba(255,255,255,0.92)',
            padding: '48px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '880px' }}>
            <div
              style={{
                fontSize: 24,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: '#5c5c5c',
              }}
            >
              Websites and lightweight systems
            </div>
            <div
              style={{
                fontSize: 78,
                lineHeight: 1,
                fontWeight: 700,
                letterSpacing: '-0.06em',
              }}
            >
              Less manual work for growing businesses.
            </div>
            <div
              style={{
                fontSize: 30,
                lineHeight: 1.45,
                color: '#4f4f4f',
                maxWidth: '820px',
              }}
            >
              {SITE_DESCRIPTION}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div
              style={{
                display: 'flex',
                gap: '14px',
                flexWrap: 'wrap',
              }}
            >
              {['Direct collaboration', 'Phased delivery', 'No technical spec needed'].map(
                item => (
                  <div
                    key={item}
                    style={{
                      border: '1px solid rgba(0,0,0,0.1)',
                      borderRadius: '999px',
                      padding: '12px 20px',
                      fontSize: 24,
                    }}
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
            <div style={{ fontSize: 34, fontWeight: 700 }}>{SITE_NAME}</div>
          </div>
        </div>
      </div>
    ),
    size,
  )
}
