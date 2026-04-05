import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Joii - 无限画布智能设计平台'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 24,
            backgroundColor: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 48,
          }}
        >
          <svg
            viewBox="0 0 32 32"
            style={{ width: '100%', height: '100%' }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="32" height="32" rx="6" fill="#000" />
            <circle cx="10" cy="10" r="4" fill="#fff" />
          </svg>
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: '#fff',
            marginBottom: 16,
            letterSpacing: '-0.02em',
          }}
        >
          Joii
        </div>
        <div
          style={{
            fontSize: 32,
            color: 'rgba(255, 255, 255, 0.7)',
            maxWidth: 800,
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        >
          无限画布智能设计平台
        </div>
        <div
            style={{
              fontSize: 24,
              color: 'rgba(255, 255, 255, 0.5)',
              marginTop: 24,
            }}
          >
            Joii.cc
          </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
