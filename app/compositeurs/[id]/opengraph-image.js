import { ImageResponse } from 'next/og'
import { supabase } from '@/lib/supabase'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Fiche compositeur — Phono.Crescendo'

export default async function Image({ params }) {
  const { id } = await params
  const { data: c } = await supabase
    .from('compositeurs')
    .select('name, born, died, nationality, period')
    .eq('id', id)
    .single()

  if (!c) {
    return new ImageResponse(
      (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafaf9', fontFamily: 'serif', fontSize: 64 }}>
          Phono.Crescendo
        </div>
      ),
      { ...size },
    )
  }

  const { data: albums } = await supabase
    .from('albums')
    .select('id, millesime_annee')
    .contains('composers', [c.name])

  const nbAlbums = albums?.length || 0
  const nbMillesimes = (albums || []).filter(a => a.millesime_annee).length

  const dates = c.born && c.died ? `${c.born}–${c.died}` : c.born ? `n. ${c.born}` : ''
  const meta = [dates, c.nationality, c.period].filter(Boolean).join(' · ')

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#fafaf9',
          padding: '72px',
          color: '#1c1917',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 24, color: '#a8a29e', letterSpacing: 5, textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
          Phono.Crescendo · Compositeur
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 112, fontWeight: 500, lineHeight: 1.05, color: '#1c1917' }}>
            {c.name}
          </div>
          {meta && (
            <div style={{ display: 'flex', fontSize: 30, color: '#78716c', marginTop: 20, fontFamily: 'sans-serif' }}>
              {meta}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', fontFamily: 'sans-serif' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 56, fontFamily: 'serif', color: '#292524' }}>{nbAlbums}</span>
            <span style={{ fontSize: 20, color: '#78716c', textTransform: 'uppercase', letterSpacing: 3 }}>
              critique{nbAlbums > 1 ? 's' : ''} Crescendo
            </span>
          </div>
          {nbMillesimes > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fef3c7', border: '2px solid #fbbf24', borderRadius: 14, padding: '16px 24px', marginLeft: 24 }}>
              <span style={{ fontSize: 32, color: '#d97706' }}>★</span>
              <span style={{ fontSize: 28, color: '#92400e', fontWeight: 600 }}>
                {nbMillesimes} Millésime{nbMillesimes > 1 ? 's' : ''} Crescendo
              </span>
            </div>
          )}
        </div>
      </div>
    ),
    { ...size },
  )
}
