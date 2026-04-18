import { ImageResponse } from 'next/og'
import { supabase } from '@/lib/supabase'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Compositrices — Le Matrimoine Crescendo'

const COMPOSITRICES = [
  'Hildegard von Bingen', 'Francesca Caccini', 'Barbara Strozzi', 'Louise Bertin',
  'Fanny Mendelssohn', 'Clara Schumann', 'Pauline Viardot', 'Augusta Holmès',
  'Louise Farrenc', 'Cécile Chaminade', 'Ethel Smyth', 'Amy Beach', 'Mel Bonis',
  'Nadia Boulanger', 'Lili Boulanger', 'Rebecca Clarke', 'Germaine Tailleferre',
  'Florence Price', 'Elsa Barraine', 'Johanna Senfter', 'Grażyna Bacewicz',
  'Galina Oustvolskaïa', 'Sofia Goubaïdoulina', 'Betsy Jolas', 'Meredith Monk',
  'Kaija Saariaho', 'Unsuk Chin', 'Margaret Brouwer', 'Jeanine Tesori',
]

export default async function Image() {
  const { data: compositeurs } = await supabase
    .from('compositeurs')
    .select('name')
    .in('name', COMPOSITRICES)

  const { count: nbMatrimoine } = await supabase
    .from('albums')
    .select('*', { count: 'exact', head: true })
    .eq('millesime_categorie', 'matrimoine')

  const nbCompositrices = compositeurs?.length || 0

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #ffe4e6 0%, #fafaf9 60%)',
          padding: '72px',
          color: '#1c1917',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 26, color: '#be123c', letterSpacing: 5, textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
          ♀ Phono.Crescendo · Matrimoine
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 120, fontWeight: 500, lineHeight: 1.05, color: '#1c1917' }}>
            Compositrices
          </div>
          <div style={{ display: 'flex', fontSize: 42, color: '#881337', marginTop: 20, fontFamily: 'sans-serif' }}>
            Le Matrimoine Crescendo
          </div>
          <div style={{ display: 'flex', fontSize: 28, color: '#57534e', marginTop: 28, fontFamily: 'sans-serif', maxWidth: 900 }}>
            Neuf siècles de création musicale féminine — de Hildegard von Bingen aux créatrices d&apos;aujourd&apos;hui
          </div>
        </div>
        <div style={{ display: 'flex', gap: 72, fontFamily: 'sans-serif' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 72, fontFamily: 'serif', color: '#881337' }}>{nbCompositrices}</span>
            <span style={{ fontSize: 22, color: '#78716c', textTransform: 'uppercase', letterSpacing: 3 }}>
              compositrices
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 72, fontFamily: 'serif', color: '#92400e' }}>{nbMatrimoine || 0}</span>
            <span style={{ fontSize: 22, color: '#78716c', textTransform: 'uppercase', letterSpacing: 3 }}>
              ★ Matrimoine
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
