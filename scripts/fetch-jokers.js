import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const API = 'https://www.crescendo-magazine.be/wp-json/wp/v2/posts'
const JOKER_CATEGORY = 9218
const PER_PAGE = 100

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function main() {
  console.log('🎴 Récupération des articles Joker...\n')
  
  let page = 1
  const jokerSlugs = []
  
  while (true) {
    const url = `${API}?categories=${JOKER_CATEGORY}&per_page=${PER_PAGE}&page=${page}&_fields=slug`
    console.log(`→ Page ${page}...`)
    
    try {
      const res = await fetch(url)
      if (res.status === 400) {
        console.log('  Fin des pages')
        break
      }
      if (!res.ok) {
        console.error(`  Erreur HTTP ${res.status}`)
        break
      }
      const posts = await res.json()
      if (!posts.length) break
      
      posts.forEach(p => jokerSlugs.push(p.slug))
      console.log(`  ${posts.length} slugs récupérés (total: ${jokerSlugs.length})`)
      
      if (posts.length < PER_PAGE) break
      page++
      await sleep(500)
    } catch (err) {
      console.error(`  Erreur : ${err.message}`)
      break
    }
  }
  
  console.log(`\n✅ ${jokerSlugs.length} articles Joker trouvés sur Crescendo`)
  
  if (jokerSlugs.length === 0) return
  
  // Reset tous les is_joker à false puis tagger ceux qui sont Jokers
  console.log('\n🔄 Mise à jour de la base...')
  
  await supabase.from('albums').update({ is_joker: false }).eq('is_joker', true)
  
  // Mettre à jour par batch de 100
  let updated = 0
  for (let i = 0; i < jokerSlugs.length; i += 100) {
    const batch = jokerSlugs.slice(i, i + 100)
    const { error, count } = await supabase
      .from('albums')
      .update({ is_joker: true }, { count: 'exact' })
      .in('id', batch)
    
    if (error) {
      console.error(`  Erreur batch ${i}: ${error.message}`)
    } else {
      updated += count || 0
      process.stdout.write('✓')
    }
  }
  
  console.log(`\n\n🏁 TERMINÉ`)
  console.log(`   Articles Joker sur Crescendo : ${jokerSlugs.length}`)
  console.log(`   Albums taggés en base         : ${updated}`)
  console.log(`   (La différence correspond aux articles Joker qui ne sont pas des chroniques disques)`)
}

main().catch(console.error)
