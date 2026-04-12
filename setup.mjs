import { writeFileSync, mkdirSync } from 'fs'

mkdirSync('lib', { recursive: true })
mkdirSync('app/compositeurs/[id]', { recursive: true })

writeFileSync('lib/supabase.js', `import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
`)

writeFileSync('app/layout.js', `import './globals.css'
export const metadata = {
  title: 'Référence Crescendo — Musique classique',
  description: 'La référence en musique classique : compositeurs, discographie, critiques.',
}
export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-stone-50 min-h-screen">
        <nav className="border-b border-stone-200 bg-white">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="text-sm font-medium text-stone-800">Référence <span className="text-stone-400 font-light">Crescendo</span></a>
            <div className="flex gap-6 text-sm text-stone-500">
              <a href="/compositeurs" className="hover:text-stone-800 transition-colors">Compositeurs</a>
              <a href="/albums" className="hover:text-stone-800 transition-colors">Albums</a>
              <a href="https://www.crescendo-magazine.be" target="_blank" rel="noopener noreferrer" className="hover:text-stone-800 transition-colors">Magazine →</a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
`)

writeFileSync('app/page.js', `import Link from 'next/link'
export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-light text-stone-800 mb-4">Référence Crescendo</h1>
      <p className="text-stone-500 mb-10 text-lg">La base de référence en musique classique</p>
      <div className="flex gap-4 justify-center">
        <Link href="/compositeurs" className="px-6 py-3 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors">
          608 Compositeurs
        </Link>
        <Link href="/albums" className="px-6 py-3 border border-stone-300 text-stone-600 rounded-lg hover:border-stone-500 transition-colors">
          5190 Albums
        </Link>
      </div>
    </main>
  )
}
`)

writeFileSync('app/compositeurs/page.js', `import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const metadata = {
  title: 'Compositeurs — Référence Crescendo',
  description: 'Catalogue de 608 compositeurs de musique classique.',
}

const PERIODES = ['Médiévale','Renaissance','Baroque','Classique','Romantique','Post-romantique','Moderne','Contemporaine']

export default async function CompositeursPage({ searchParams }) {
  const periode = (await searchParams)?.periode || null
  let query = supabase
    .from('compositeurs')
    .select('id, name, nationality, period, familiarity, born, died')
    .order('born', { ascending: true })
  if (periode) query = query.eq('period', periode)
  const { data: compositeurs } = await query
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-light mb-2 text-stone-800">Compositeurs</h1>
      <p className="text-stone-500 mb-8">{compositeurs?.length || 0} compositeurs · Référence Crescendo Magazine</p>
      <div className="flex flex-wrap gap-2 mb-8">
        <Link href="/compositeurs" className={\`px-3 py-1 text-sm rounded-full border transition-colors \${!periode ? 'bg-stone-800 text-white border-stone-800' : 'border-stone-300 text-stone-600 hover:border-stone-500'}\`}>Toutes</Link>
        {PERIODES.map(p => (
          <Link key={p} href={\`/compositeurs?periode=\${p}\`} className={\`px-3 py-1 text-sm rounded-full border transition-colors \${periode === p ? 'bg-stone-800 text-white border-stone-800' : 'border-stone-300 text-stone-600 hover:border-stone-500'}\`}>{p}</Link>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {compositeurs?.map(c => (
          <Link key={c.id} href={\`/compositeurs/\${c.id}\`} className="block p-4 border border-stone-200 rounded-lg hover:border-stone-400 hover:shadow-sm transition-all">
            <div className="flex justify-between items-start mb-1">
              <h2 className="font-medium text-stone-800 text-sm leading-snug">{c.name}</h2>
              {c.familiarity === 'rare' && <span className="text-xs border border-amber-400 text-amber-600 px-1.5 py-0.5 rounded ml-2 shrink-0">Rare</span>}
            </div>
            <p className="text-xs text-stone-400">{c.born && c.died ? \`\${c.born}–\${c.died}\` : ''}{c.nationality ? \` · \${c.nationality}\` : ''}</p>
            <p className="text-xs text-stone-500 mt-1">{c.period}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
`)

writeFileSync('app/compositeurs/[id]/page.js', `import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }) {
  const id = (await params).id
  const { data: c } = await supabase.from('compositeurs').select('name, description').eq('id', id).single()
  if (!c) return {}
  return { title: \`\${c.name} — Référence Crescendo\`, description: c.description?.slice(0, 160) }
}

export default async function CompositeurPage({ params }) {
  const id = (await params).id
  const { data: c } = await supabase.from('compositeurs').select('*').eq('id', id).single()
  if (!c) notFound()

  const { data: albums } = await supabase
    .from('albums')
    .select('id, title, article_title, label, published_at, critique_url, notes, cover_url')
    .contains('composers', [c.name])
    .order('published_at', { ascending: false })
    .limit(20)

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/compositeurs" className="text-sm text-stone-400 hover:text-stone-600 mb-6 inline-block">← Compositeurs</Link>
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-3xl font-light text-stone-800">{c.name}</h1>
          {c.familiarity === 'rare' && <span className="text-xs border border-amber-400 text-amber-600 px-2 py-1 rounded shrink-0 mt-1">Rare</span>}
        </div>
        <p className="text-stone-400 text-sm mb-4">
          {c.born && c.died ? \`\${c.born}–\${c.died}\` : ''}{c.nationality ? \` · \${c.nationality}\` : ''}{c.period ? \` · \${c.period}\` : ''}
        </p>
        {c.description && <p className="text-stone-600 leading-relaxed">{c.description}</p>}
      </div>
      {c.key_works?.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-medium uppercase tracking-widest text-stone-400 mb-3">Œuvres majeures</h2>
          <ul className="space-y-1">
            {c.key_works.map((w, i) => (
              <li key={i} className="text-stone-600 text-sm flex gap-2"><span className="text-stone-300">○</span> {w}</li>
            ))}
          </ul>
        </section>
      )}
      <section className="mb-10 flex gap-3 flex-wrap">
        <a href={\`https://www.crescendo-magazine.be/?s=\${encodeURIComponent(c.name)}\`} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 border border-stone-300 rounded hover:border-stone-500 text-stone-600 transition-colors">Rechercher sur Crescendo</a>
        <a href={\`https://www.youtube.com/results?search_query=\${encodeURIComponent(c.name)}\`} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 border border-stone-300 rounded hover:border-stone-500 text-stone-600 transition-colors">YouTube</a>
      </section>
      {albums && albums.length > 0 && (
        <section>
          <h2 className="text-xs font-medium uppercase tracking-widest text-stone-400 mb-4">Critiques Crescendo ({albums.length})</h2>
          <div className="space-y-3">
            {albums.map(a => (
              <a key={a.id} href={a.critique_url} target="_blank" rel="noopener noreferrer" className="flex gap-3 p-3 border border-stone-200 rounded-lg hover:border-stone-400 transition-all group">
                {a.cover_url && <img src={a.cover_url} alt="" className="w-12 h-12 object-cover rounded shrink-0" />}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-stone-700 group-hover:text-stone-900 truncate">{a.title || a.article_title}</p>
                  <p className="text-xs text-stone-400 mt-0.5">{a.label && \`\${a.label} · \`}{a.published_at ? new Date(a.published_at).getFullYear() : ''}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
`)

console.log('✅ Tous les fichiers créés !')
