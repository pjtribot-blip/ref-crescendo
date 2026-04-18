import { ImageResponse } from 'next/og'
import { supabase } from '@/lib/supabase'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Les Millésimes Crescendo — sélection annuelle de la rédaction'

const EDITIONS = { 2021: '1ʳᵉ', 2022: '2ᵉ', 2023: '3ᵉ', 2024: '4ᵉ', 2025: '5ᵉ' }

export default async function Image({ params }) {
  const { annee } = await params
  const anneeNum = parseInt(annee, 10)

  const { count } = await supabase
    .from('albums')
    .select('*', { count: 'exact', head: true })
    .eq('millesime_annee', anneeNum)

  const edition = EDITIONS[anneeNum] || ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #fef3c7 0%, #fafaf9 100%)',
          padding: '72px',
          color: '#1c1917',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 28, color: '#92400e', letterSpacing: 5, textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
          ★ Phono.Crescendo · Millésimes
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 36, color: '#92400e', fontFamily: 'sans-serif', letterSpacing: 2 }}>
            {edition} édition
          </div>
          <div style={{ display: 'flex', fontSize: 180, fontWeight: 500, lineHeight: 1, marginTop: 16, color: '#292524' }}>
            Millésimes {anneeNum}
          </div>
          <div style={{ display: 'flex', fontSize: 36, color: '#57534e', marginTop: 28, fontFamily: 'sans-serif' }}>
            {count || 0} albums primés par la rédaction de Crescendo Magazine
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 22, color: '#a8a29e', fontFamily: 'sans-serif', letterSpacing: 2, textTransform: 'uppercase' }}>
          ref.crescendo-magazine.be
        </div>
      </div>
    ),
    { ...size },
  )
}
