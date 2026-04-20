import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { LABELS_BELGES } from '@/lib/labels-belges'
import { EXCLUDED_LABELS } from '@/lib/excluded-labels'
import { ORDRE_PERIODES } from '@/lib/periodes'
import {
  getAlbumsCount,
  getCompositeursCount,
  getMillesimesCount,
  getJokersCount,
  fetchAllAlbums,
} from '@/lib/stats-counts'

export const metadata = {
  title: 'En chiffres',
  description: "Crescendo Magazine en données : 32 ans d'édition critique en musique classique, compositeurs, labels, Millésimes et Jokers.",
  openGraph: {
    type: 'website',
    title: 'Phono.Crescendo en chiffres',
    description: "32 ans d'édition critique en musique classique, un paysage en données.",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Phono.Crescendo en chiffres',
    description: "32 ans d'édition critique en musique classique, un paysage en données.",
  },
}

export const revalidate = 3600

const ANNEES_VOLUME = [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]

const COMPOSITRICES = [
  'Hildegard von Bingen', 'Francesca Caccini', 'Barbara Strozzi', 'Louise Bertin',
  'Fanny Mendelssohn', 'Clara Schumann', 'Pauline Viardot', 'Augusta Holmès',
  'Louise Farrenc', 'Cécile Chaminade', 'Ethel Smyth', 'Amy Beach', 'Mel Bonis',
  'Nadia Boulanger', 'Lili Boulanger', 'Rebecca Clarke', 'Germaine Tailleferre',
  'Florence Price', 'Elsa Barraine', 'Johanna Senfter', 'Grażyna Bacewicz',
  'Galina Oustvolskaïa', 'Sofia Goubaïdoulina', 'Betsy Jolas', 'Meredith Monk',
  'Kaija Saariaho', 'Unsuk Chin', 'Margaret Brouwer', 'Jeanine Tesori',
]
const COMPOSITRICES_SET = new Set(COMPOSITRICES)

export default async function StatistiquesPage() {
  // Big numbers via count exact (serveur), strictement identiques à la home
  // (les 4 helpers sont importés du même module `lib/stats-counts`).
  // Agrégations via pagination pour contourner la limite PostgREST 1000.
  const [
    nbAlbums,
    nbCompositeurs,
    nbMillesimes,
    nbJokers,
    albums,
    compositeursRes,
  ] = await Promise.all([
    getAlbumsCount(),
    getCompositeursCount(),
    getMillesimesCount(),
    getJokersCount(),
    fetchAllAlbums('composers, label, published_at, millesime_annee, millesime_categorie, millesime_label, is_joker, title'),
    supabase.from('compositeurs').select('name, period'),
  ])

  const compositeurs = compositeursRes.data || []

  // Labels distincts (exclusion Outhere et autres holdings via EXCLUDED_LABELS)
  const labelsSet = new Set()
  for (const a of albums) {
    if (a.label && !EXCLUDED_LABELS.has(a.label)) labelsSet.add(a.label)
  }
  const nbLabels = labelsSet.size
  const nbCompositrices = compositeurs.filter(c => COMPOSITRICES_SET.has(c.name)).length
  const nbLabelsBelges = LABELS_BELGES
    .filter(l => !EXCLUDED_LABELS.has(l))
    .filter(l => labelsSet.has(l))
    .length

  // Volume annuel
  const volumeParAnnee = Object.fromEntries(ANNEES_VOLUME.map(y => [y, 0]))
  for (const a of albums) {
    if (!a.published_at) continue
    const y = new Date(a.published_at).getFullYear()
    if (y in volumeParAnnee) volumeParAnnee[y]++
  }
  const volumeMax = Math.max(...Object.values(volumeParAnnee), 1)

  // Top compositeurs
  const countComp = {}
  for (const a of albums) {
    const names = Array.isArray(a.composers) ? a.composers : []
    for (const n of names) countComp[n] = (countComp[n] || 0) + 1
  }
  const topCompositeurs = Object.entries(countComp)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)

  // Top labels (EXCLUDED_LABELS filtrés)
  const statsLabels = {}
  for (const a of albums) {
    if (!a.label || EXCLUDED_LABELS.has(a.label)) continue
    if (!statsLabels[a.label]) statsLabels[a.label] = { count: 0, millesimes: 0 }
    statsLabels[a.label].count++
    if (a.millesime_annee) statsLabels[a.label].millesimes++
  }
  const topLabels = Object.entries(statsLabels)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 15)

  // Périodes
  const periodes = Object.fromEntries(ORDRE_PERIODES.map(p => [p, 0]))
  for (const c of compositeurs) {
    if (c.period && c.period in periodes) periodes[c.period]++
  }
  const totalPeriodes = Object.values(periodes).reduce((s, n) => s + n, 0)

  // Matrimoine
  const albumsAvecCompositrice = albums.filter(a => {
    const names = Array.isArray(a.composers) ? a.composers : []
    return names.some(n => COMPOSITRICES_SET.has(n))
  }).length
  const millesimesMatrimoine = albums
    .filter(a => a.millesime_categorie === 'matrimoine')
    .sort((a, b) => (b.millesime_annee || 0) - (a.millesime_annee || 0))

  // Jokers par année
  const jokersParAnnee = Object.fromEntries(ANNEES_VOLUME.map(y => [y, 0]))
  for (const a of albums) {
    if (!a.is_joker || !a.published_at) continue
    const y = new Date(a.published_at).getFullYear()
    if (y in jokersParAnnee) jokersParAnnee[y]++
  }
  const jokersMax = Math.max(...Object.values(jokersParAnnee), 1)

  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-serif text-stone-900 mb-4">Phono.Crescendo</h1>
        <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
          Les chiffres et les statistiques
        </p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-16">
        <BigNumber value={nbAlbums} label="Critiques" href="/albums" />
        <BigNumber value={nbCompositeurs} label="Compositeurs" href="/compositeurs" />
        <BigNumber value={nbLabels} label="Labels" href="/labels" />
        <BigNumber value={nbMillesimes} label="Millésimes" href="/millesimes" tone="amber" />
        <BigNumber value={nbJokers} label="Jokers" href="/jokers" tone="amber" />
        <BigNumber value={nbCompositrices} label="Compositrices" href="/compositrices" tone="rose" />
        <BigNumber value={nbLabelsBelges} label="Labels belges" href="/belgique" tone="orange" />
        <BigNumber value={1993} label="Année de fondation" tone="stone" />
      </section>

      <Section title="Volume annuel de critiques publiées" subtitle="Nombre d'albums chroniqués par année de publication (2013–2025)">
        <BarChart
          data={ANNEES_VOLUME.map(y => ({ label: String(y), value: volumeParAnnee[y] }))}
          max={volumeMax}
          barColor="fill-stone-700"
          axisLabel="critiques / an"
        />
      </Section>

      <Section title="Top 15 — Compositeurs les plus chroniqués" subtitle="Nombre d'albums dans la référence où le compositeur apparaît dans la liste composers">
        <RankingTable rows={topCompositeurs} valueLabel="albums" />
      </Section>

      <Section title="Top 15 — Labels" subtitle="Les maisons discographiques les plus présentes dans la référence, et leurs Millésimes">
        <LabelTable rows={topLabels} />
      </Section>

      <Section title="Répartition des compositeurs par période" subtitle="608 compositeurs répartis sur neuf siècles de musique écrite">
        <PeriodeBars periodes={periodes} total={totalPeriodes} />
      </Section>

      <Section title="Le Matrimoine en chiffres" subtitle="La redécouverte de l'art des compositrices, mission éditoriale forte de la rédaction">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <MiniStat value={nbCompositrices} label="compositrices référencées" tone="rose" />
          <MiniStat value={albumsAvecCompositrice} label="albums avec une compositrice" tone="rose" />
          <MiniStat value={millesimesMatrimoine.length} label="Millésime(s) Matrimoine" tone="amber" />
        </div>
        {millesimesMatrimoine.length > 0 && (
          <div className="border border-rose-200 bg-rose-50/40 rounded-xl p-5">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-rose-800 mb-3">
              Millésimes Matrimoine par édition
            </h4>
            <ul className="space-y-2 text-sm">
              {millesimesMatrimoine.map((a, i) => {
                const composer = Array.isArray(a.composers) ? (a.composers[0] || '') : ''
                return (
                  <li key={i} className="flex flex-wrap gap-x-3 text-stone-700">
                    <span className="text-rose-800 font-semibold shrink-0">{a.millesime_annee}</span>
                    <span className="flex-1">
                      <span className="font-medium">{a.title}</span>
                      {composer && <span className="text-stone-500"> — {composer}</span>}
                      {a.label && <span className="text-stone-400 text-xs"> · {a.label}</span>}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </Section>

      <Section title="Les Jokers au fil du temps" subtitle="Les coups de cœur mensuels de la rédaction, par année de publication">
        <BarChart
          data={ANNEES_VOLUME.map(y => ({ label: String(y), value: jokersParAnnee[y] }))}
          max={jokersMax}
          barColor="fill-amber-500"
          axisLabel="Jokers / an"
        />
      </Section>

      <section className="border-t border-stone-200 pt-10 mt-12">
        <p className="text-stone-700 leading-relaxed max-w-3xl mx-auto text-center">
          Depuis <strong>1993</strong>, Crescendo Magazine écrit au fil des mois l&apos;histoire vivante de la
          musique classique francophone. Ces quelques chiffres ne disent qu&apos;un fragment de l&apos;aventure :
          derrière chacun d&apos;eux, une critique signée, une rencontre, un enregistrement écouté, un combat
          éditorial — pour que les grandes œuvres continuent de circuler et que les créatrices et créateurs
          d&apos;aujourd&apos;hui trouvent leur place aux côtés des classiques du patrimoine. Ces chiffres ne
          reprennent que les articles publiés en ligne depuis 2012 et une partie des jokers doivent encore
          être indexés à la main. Phono.Crescendo est développée en continu.
        </p>
        <p className="text-sm italic text-stone-500 text-center mt-4">— La rédaction</p>
      </section>
    </main>
  )
}

function Section({ title, subtitle, children }) {
  return (
    <section className="mb-16">
      <div className="mb-5 pb-2 border-b border-stone-200">
        <h2 className="text-2xl font-serif text-stone-900">{title}</h2>
        {subtitle && <p className="text-sm text-stone-500 mt-1">{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}

function BigNumber({ value, label, href, tone = 'stone' }) {
  const tones = {
    stone: { card: 'border-stone-200 bg-white hover:border-stone-400', val: 'text-stone-900', lab: 'text-stone-500' },
    amber: { card: 'border-amber-200 bg-amber-50/40 hover:border-amber-400', val: 'text-amber-900', lab: 'text-amber-800' },
    rose: { card: 'border-rose-200 bg-rose-50/40 hover:border-rose-400', val: 'text-rose-900', lab: 'text-rose-800' },
    orange: { card: 'border-orange-200 bg-orange-50/40 hover:border-orange-400', val: 'text-orange-900', lab: 'text-orange-800' },
  }
  const t = tones[tone] || tones.stone
  const inner = (
    <div className={`p-4 border rounded-xl text-center transition-all ${t.card}`}>
      <p className={`text-3xl font-serif ${t.val}`}>{value.toLocaleString('fr-FR')}</p>
      <p className={`text-xs uppercase tracking-wider mt-1 ${t.lab}`}>{label}</p>
    </div>
  )
  return href ? <Link href={href}>{inner}</Link> : inner
}

function MiniStat({ value, label, tone = 'stone' }) {
  const tones = {
    stone: 'border-stone-200 bg-white text-stone-900',
    amber: 'border-amber-200 bg-amber-50/40 text-amber-900',
    rose: 'border-rose-200 bg-rose-50/40 text-rose-900',
  }
  return (
    <div className={`p-4 border rounded-xl text-center ${tones[tone] || tones.stone}`}>
      <p className="text-3xl font-serif">{value.toLocaleString('fr-FR')}</p>
      <p className="text-xs text-stone-600 mt-1">{label}</p>
    </div>
  )
}

function BarChart({ data, max, barColor = 'fill-stone-700', axisLabel }) {
  const width = 720
  const height = 280
  const padLeft = 36
  const padRight = 12
  const padTop = 16
  const padBottom = 44
  const plotW = width - padLeft - padRight
  const plotH = height - padTop - padBottom
  const barW = plotW / data.length * 0.65
  const step = plotW / data.length

  const gridTicks = [0, 0.25, 0.5, 0.75, 1].map(t => Math.round(max * t))

  return (
    <div className="border border-stone-200 rounded-xl bg-white p-4 overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img" aria-label={axisLabel}>
        {gridTicks.map((t, i) => {
          const y = padTop + plotH - (t / max) * plotH
          return (
            <g key={i}>
              <line x1={padLeft} x2={width - padRight} y1={y} y2={y} className="stroke-stone-100" strokeWidth="1" />
              <text x={padLeft - 6} y={y + 3} textAnchor="end" className="fill-stone-400 text-[10px]">{t}</text>
            </g>
          )
        })}
        {data.map((d, i) => {
          const h = d.value === 0 ? 0 : Math.max(2, (d.value / max) * plotH)
          const x = padLeft + i * step + (step - barW) / 2
          const y = padTop + plotH - h
          return (
            <g key={d.label}>
              <rect x={x} y={y} width={barW} height={h} className={barColor} rx="2" />
              {d.value > 0 && (
                <text x={x + barW / 2} y={y - 4} textAnchor="middle" className="fill-stone-600 text-[10px] font-medium">{d.value}</text>
              )}
              <text x={x + barW / 2} y={height - padBottom + 16} textAnchor="middle" className="fill-stone-500 text-[10px]">{d.label}</text>
            </g>
          )
        })}
        <line x1={padLeft} x2={width - padRight} y1={padTop + plotH} y2={padTop + plotH} className="stroke-stone-300" strokeWidth="1" />
        {axisLabel && (
          <text x={width - padRight} y={height - 6} textAnchor="end" className="fill-stone-400 text-[10px] italic">{axisLabel}</text>
        )}
      </svg>
    </div>
  )
}

function RankingTable({ rows, valueLabel }) {
  const max = Math.max(...rows.map(([, v]) => v), 1)
  return (
    <div className="border border-stone-200 rounded-xl bg-white overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-50">
            <th className="text-left px-4 py-2 text-xs uppercase tracking-wider text-stone-500 w-10">#</th>
            <th className="text-left px-4 py-2 text-xs uppercase tracking-wider text-stone-500">Nom</th>
            <th className="text-right px-4 py-2 text-xs uppercase tracking-wider text-stone-500">{valueLabel}</th>
            <th className="w-1/3 px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, count], i) => {
            const w = Math.round((count / max) * 100)
            return (
              <tr key={name} className="border-b border-stone-100 last:border-0">
                <td className="px-4 py-2 text-stone-400 font-mono text-xs">{i + 1}</td>
                <td className="px-4 py-2 text-stone-800 font-medium">{name}</td>
                <td className="px-4 py-2 text-right text-stone-700 tabular-nums">{count}</td>
                <td className="px-4 py-2">
                  <div className="h-2 bg-stone-100 rounded overflow-hidden">
                    <div className="h-full bg-stone-700" style={{ width: `${w}%` }} />
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function LabelTable({ rows }) {
  const max = Math.max(...rows.map(([, v]) => v.count), 1)
  return (
    <div className="border border-stone-200 rounded-xl bg-white overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-50">
            <th className="text-left px-4 py-2 text-xs uppercase tracking-wider text-stone-500 w-10">#</th>
            <th className="text-left px-4 py-2 text-xs uppercase tracking-wider text-stone-500">Label</th>
            <th className="text-right px-4 py-2 text-xs uppercase tracking-wider text-stone-500">Albums</th>
            <th className="text-right px-4 py-2 text-xs uppercase tracking-wider text-amber-800">Millésimes</th>
            <th className="w-1/3 px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, stats], i) => {
            const w = Math.round((stats.count / max) * 100)
            return (
              <tr key={name} className="border-b border-stone-100 last:border-0">
                <td className="px-4 py-2 text-stone-400 font-mono text-xs">{i + 1}</td>
                <td className="px-4 py-2 text-stone-800 font-medium">
                  <Link href={`/albums?label=${encodeURIComponent(name)}`} className="hover:text-stone-600 underline underline-offset-2 decoration-stone-200">
                    {name}
                  </Link>
                </td>
                <td className="px-4 py-2 text-right text-stone-700 tabular-nums">{stats.count}</td>
                <td className="px-4 py-2 text-right tabular-nums">
                  {stats.millesimes > 0 ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-100 border border-amber-300 text-amber-900 px-1.5 py-0.5 rounded">
                      ★ {stats.millesimes}
                    </span>
                  ) : (
                    <span className="text-stone-300">—</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <div className="h-2 bg-stone-100 rounded overflow-hidden">
                    <div className="h-full bg-stone-700" style={{ width: `${w}%` }} />
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function PeriodeBars({ periodes, total }) {
  const max = Math.max(...Object.values(periodes), 1)
  return (
    <div className="border border-stone-200 rounded-xl bg-white p-5 space-y-3">
      {ORDRE_PERIODES.map(p => {
        const v = periodes[p]
        // Masque le bucket transitoire « Contemporaine » quand il est vide
        // (tous les compositeurs ont été reclassés automatiquement).
        if (p === 'Contemporaine' && v === 0) return null
        const w = Math.round((v / max) * 100)
        const pct = total > 0 ? Math.round((v / total) * 100) : 0
        return (
          <div key={p} className="grid grid-cols-[140px_1fr_70px] items-center gap-3 text-sm">
            <span className="text-stone-700">{p}</span>
            <div className="h-5 bg-stone-100 rounded overflow-hidden">
              <div className="h-full bg-gradient-to-r from-stone-600 to-stone-800" style={{ width: `${w}%` }} />
            </div>
            <span className="text-right text-stone-600 tabular-nums">
              {v} <span className="text-stone-400 text-xs">({pct}%)</span>
            </span>
          </div>
        )
      })}
    </div>
  )
}
