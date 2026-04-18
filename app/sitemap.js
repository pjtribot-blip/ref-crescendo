import { supabase } from '@/lib/supabase'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ref.crescendo-magazine.be'
const ANNEES_MILLESIMES = ['2021', '2022', '2023', '2024', '2025']

const STATIC_ROUTES = [
  { path: '/', priority: 1.0, changeFrequency: 'daily' },
  { path: '/albums', priority: 0.9, changeFrequency: 'daily' },
  { path: '/compositeurs', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/compositrices', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/interpretes', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/labels', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/millesimes', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/millesimes/matrimoine', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/palmares', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/belgique', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/jokers', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/statistiques', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/recherche', priority: 0.5, changeFrequency: 'monthly' },
]

export default async function sitemap() {
  const now = new Date()

  const { data: compositeurs } = await supabase.from('compositeurs').select('id')

  const staticEntries = STATIC_ROUTES.map(r => ({
    url: `${BASE_URL}${r.path === '/' ? '' : r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))

  const millesimesEntries = ANNEES_MILLESIMES.map(annee => ({
    url: `${BASE_URL}/millesimes/${annee}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const palmaresEntries = ANNEES_MILLESIMES.map(annee => ({
    url: `${BASE_URL}/palmares/${annee}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const compositeursEntries = (compositeurs || []).map(c => ({
    url: `${BASE_URL}/compositeurs/${c.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [
    ...staticEntries,
    ...millesimesEntries,
    ...palmaresEntries,
    ...compositeursEntries,
  ]
}
