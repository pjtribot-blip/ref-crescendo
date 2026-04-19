import { ImageResponse } from 'next/og'
import { supabase } from '@/lib/supabase'
import { LABELS_BELGES } from '@/lib/labels-belges'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'La scène musicale belge — Phono.Crescendo'

export default async function Image() {
  const { data: albums } = await supabase
    .from('albums')
    .select('millesime_annee')
    .in('label', LABELS_BELGES)

  const nbAlbums = albums?.length || 0
  const nbMillesimes = (albums || []).filter(a => a.millesime_annee).length

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#fafaf9',
          color: '#1c1917',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', width: '100%', height: 14 }}>
          <div style={{ display: 'flex', flex: 1, background: '#0a0a0a' }} />
          <div style={{ display: 'flex', flex: 1, background: '#fbbf24' }} />
          <div style={{ display: 'flex', flex: 1, background: '#dc2626' }} />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            padding: '64px 72px 72px 72px',
          }}
        >
          <div style={{ display: 'flex', fontSize: 26, color: '#c2410c', letterSpacing: 5, textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
            🇧🇪 Phono.Crescendo · Belgique
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 112, fontWeight: 500, lineHeight: 1.05, color: '#1c1917' }}>
              La scène musicale belge
            </div>
            <div style={{ display: 'flex', fontSize: 30, color: '#57534e', marginTop: 28, fontFamily: 'sans-serif', maxWidth: 1000 }}>
              Compositeurs, interprètes, ensembles, orchestres, salles, festivals et labels
            </div>
          </div>
          <div style={{ display: 'flex', gap: 72, fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 64, fontFamily: 'serif', color: '#1c1917' }}>{nbAlbums}</span>
              <span style={{ fontSize: 22, color: '#78716c', textTransform: 'uppercase', letterSpacing: 3 }}>
                albums · labels belges
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 64, fontFamily: 'serif', color: '#92400e' }}>{nbMillesimes}</span>
              <span style={{ fontSize: 22, color: '#78716c', textTransform: 'uppercase', letterSpacing: 3 }}>
                ★ Millésimes
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
