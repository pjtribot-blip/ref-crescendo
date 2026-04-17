import { createClient } from '@supabase/supabase-js'
import { parse } from 'node-html-parser'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const PAUSE_MS = 800
const BATCH_SIZE = 50

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function fetchCover(url) {
  try {
    const res = await fetch(url, { 
      headers: { 'User-Agent': 'ref-crescendo-covers/1.0' },
      signal: AbortSignal.timeout(15000)
    })
    if (!res.ok) return null
    const doc = parse(await res.text())
    const img = doc.querySelector('.entry-content img')
    return img?.getAttribute('src') || null
  } catch (err) {
    return null
  }
}

async function main() {
  console.log('🎵 Fetching missing covers...\n')
  let totalDone = 0
  let totalFound = 0
  
  while (true) {
    const { data: albums, error } = await supabase
      .from('albums')
      .select('id, critique_url')
      .is('cover_url', null)
      .not('critique_url', 'is', null)
      .limit(BATCH_SIZE)
    
    if (error) { console.error('Supabase error:', error.message); break }
    if (!albums || albums.length === 0) { console.log('\n✅ Plus rien à traiter'); break }
    
    console.log(`\n→ Batch : ${albums.length} albums restants`)
    
    for (const album of albums) {
      const cover = await fetchCover(album.critique_url)
      totalDone++
      
      if (cover) {
        const { error: upErr } = await supabase
          .from('albums')
          .update({ cover_url: cover })
          .eq('id', album.id)
        
        if (!upErr) {
          totalFound++
          process.stdout.write('✓')
        } else {
          process.stdout.write('!')
        }
      } else {
        // Marquer avec une URL vide pour ne pas retraiter
        await supabase.from('albums').update({ cover_url: '' }).eq('id', album.id)
        process.stdout.write('·')
      }
      
      await sleep(PAUSE_MS)
    }
    
    console.log(`\n   Progress : ${totalDone} traités, ${totalFound} covers trouvées`)
  }
  
  console.log(`\n\n🏁 TERMINÉ`)
  console.log(`   Total traités    : ${totalDone}`)
  console.log(`   Covers trouvées  : ${totalFound}`)
}

main().catch(console.error)
