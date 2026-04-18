import { ImageResponse } from 'next/og'
import { supabase } from '@/lib/supabase'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Phono.Crescendo en chiffres'

export default async function Image() {
  const [albumsRes, compositeursRes, millesimesRes, jokersRes] = await Promise.all([
    supabase.from('albums').select('*', { count: 'exact', head: true }),
    supabase.from('compositeurs').select('*', { count: 'exact', head: true }),
    supabase.from('albums').select('*', { count: 'exact', head: true }).not('millesime_annee', 'is', null),
    supabase.from('albums').select('*', { count: 'exact', head: true }).eq('is_joker', true),
  ])

  const stats = [
    { value: albumsRes.count || 0, label: 'Critiques', tone: '#1c1917' },
    { value: compositeursRes.count || 0, label: 'Compositeurs', tone: '#1c1917' },
    { value: millesimesRes.count || 0, label: 'Millésimes', tone: '#92400e' },
    { value: jokersRes.count || 0, label: 'Jokers', tone: '#c2410c' },
  ]

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
          <div style={{ display: 'flex', fontSize: 24, color: '#a8a29e', letterSpacing: 5, textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
            Phono.Crescendo · Chiffres
          </div>
          <div style={{ display: 'flex', fontSize: 120, fontWeight: 500, lineHeight: 1.05, marginTop: 20 }}>
            En chiffres
          </div>
          <div style={{ display: 'flex', fontSize: 32, color: '#57534e', marginTop: 20, fontFamily: 'sans-serif', maxWidth: 1000 }}>
            32 ans d&apos;édition critique en musique classique, un paysage en données
          </div>
        </div>
        <div style={{ display: 'flex', gap: 48, fontFamily: 'sans-serif' }}>
          {stats.map(s => (
            <div key={s.label} style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 72, fontFamily: 'serif', color: s.tone }}>
                {s.value.toLocaleString('fr-FR')}
              </span>
              <span style={{ fontSize: 20, color: '#78716c', textTransform: 'uppercase', letterSpacing: 3 }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  )
}
