import { ImageResponse } from 'next/og'
import { supabase } from '@/lib/supabase'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Phono.Crescendo — la base de données des critiques phonographiques de Crescendo Magazine'

export default async function Image() {
  const [albumsRes, compositeursRes, millesimesRes] = await Promise.all([
    supabase.from('albums').select('*', { count: 'exact', head: true }),
    supabase.from('compositeurs').select('*', { count: 'exact', head: true }),
    supabase.from('albums').select('*', { count: 'exact', head: true }).not('millesime_annee', 'is', null),
  ])
  const nbAlbums = albumsRes.count || 0
  const nbCompositeurs = compositeursRes.count || 0
  const nbMillesimes = millesimesRes.count || 0

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
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 24, color: '#a8a29e', letterSpacing: 5, textTransform: 'uppercase' }}>
            Crescendo Magazine · depuis 1993
          </div>
          <div style={{ display: 'flex', fontSize: 132, fontWeight: 500, lineHeight: 1.05, marginTop: 28 }}>
            Phono.Crescendo
          </div>
          <div style={{ display: 'flex', fontSize: 34, color: '#57534e', marginTop: 24, maxWidth: 1000, fontFamily: 'sans-serif' }}>
            La base de données des critiques phonographiques
          </div>
        </div>
        <div style={{ display: 'flex', gap: 56, fontFamily: 'sans-serif' }}>
          <Stat value={nbAlbums} label="critiques" />
          <Stat value={nbCompositeurs} label="compositeurs" />
          <Stat value={nbMillesimes} label="Millésimes" tone="amber" />
        </div>
      </div>
    ),
    { ...size },
  )
}

function Stat({ value, label, tone }) {
  const color = tone === 'amber' ? '#92400e' : '#1c1917'
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: 72, fontFamily: 'serif', color }}>{value.toLocaleString('fr-FR')}</span>
      <span style={{ fontSize: 22, color: '#78716c', textTransform: 'uppercase', letterSpacing: 3 }}>{label}</span>
    </div>
  )
}
