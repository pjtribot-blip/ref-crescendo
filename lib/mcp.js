import { supabase } from './supabase'
import { SITE_URL } from './site'
import { findCompositeur } from './compositeurs'
import { visibleLabel } from './excluded-labels'
import { icma, getIcmaAwards, getIcmaAwardsForComposer, plierNom } from './icma'
import { ICMA_CRITIQUES } from './icma-critiques'

/**
 * Serveur MCP (Model Context Protocol) de Phono.Crescendo : SITE_URL/mcp
 * Permet aux assistants IA (Claude, ChatGPT, Copilot, Cursor…) d'interroger
 * les critiques de disques de Crescendo Magazine, ses Millésimes et Jokers,
 * et le palmarès ICMA. Même conception que le serveur de Pauline : transport
 * « Streamable HTTP » sans état, réponses JSON simples, lecture seule, sans clé.
 */

const VERSIONS = ['2025-06-18', '2025-03-26', '2024-11-05']
const ALBUM_FIELDS = 'id, title, article_title, label, published_at, critique_url, composers, millesime_annee, millesime_label, is_joker'

const ok = (text, structured) => ({ content: [{ type: 'text', text }], ...(structured ? { structuredContent: structured } : {}) })
const err = text => ({ content: [{ type: 'text', text }], isError: true })
const borne = (n, min, max, def) => Math.min(Math.max(parseInt(n, 10) || def, min), max)
const annee = a => (a.published_at ? String(a.published_at).slice(0, 4) : null)
const ficheUrl = c => `${SITE_URL}/compositeurs/${encodeURIComponent(c.id)}`

function distinction(a) {
  if (a.millesime_annee) return `Millésime ${a.millesime_annee}${a.millesime_label ? ` (${a.millesime_label})` : ''}`
  if (a.is_joker) return 'Joker'
  return null
}

function ligneAlbum(a) {
  const meta = [visibleLabel(a.label), annee(a)].filter(Boolean).join(', ')
  const d = distinction(a)
  return `- ${a.title || a.article_title}${meta ? ` — ${meta}` : ''}${d ? ` — ${d}` : ''}` +
    `${a.composers?.length ? ` — ${a.composers.join(', ')}` : ''} — critique : ${a.critique_url}`
}

const albumJson = a => ({
  titre: a.title || a.article_title,
  label: visibleLabel(a.label) || null,
  annee: annee(a) ? Number(annee(a)) : null,
  compositeurs: a.composers || [],
  distinction: distinction(a),
  critique_url: a.critique_url,
})

// Compositeur par identifiant, adresse de fiche ou nom (graphies tolérées)
async function trouverCompositeur(q, columns = 'id, name') {
  const s = String(q || '').trim().replace(/^.*\/compositeurs\/([^/?#]+).*$/, '$1')
  if (!s) return { c: null, suggestions: [] }
  const parId = await findCompositeur(s, columns)
  if (parId.c) return { c: parId.c, suggestions: [] }
  const { data } = await supabase.from('compositeurs').select(columns)
  const tous = data || []
  const f = plierNom(s)
  const exact = tous.find(c => plierNom(c.name) === f)
  if (exact) return { c: exact, suggestions: [] }
  const proches = tous.filter(c => plierNom(c.name).includes(f) || f.includes(plierNom(c.name).split(' ').pop()))
  if (proches.length === 1) return { c: proches[0], suggestions: [] }
  return { c: null, suggestions: proches.slice(0, 5).map(c => c.name) }
}

const inconnu = (q, suggestions) => err(`Aucun compositeur « ${q} » dans Phono.Crescendo.` +
  (suggestions.length ? ` Vouliez-vous dire : ${suggestions.join(', ')} ?` : ' Essayez chercher_critiques avec un texte.'))

const TOOLS = [
  {
    name: 'chercher_critiques',
    title: 'Chercher des critiques de disques',
    description: 'Recherche dans plus de 5 000 critiques de disques de musique classique publiées par Crescendo Magazine (Belgique) depuis 1993. Tous les critères sont facultatifs et combinables (ex. « Bach chez Harmonia Mundi », « les Jokers de 2024 », « Winterreise »). Renvoie titre, label, année, compositeurs, distinction éventuelle (Millésime, Joker) et lien vers la critique complète.',
    inputSchema: {
      type: 'object',
      properties: {
        texte: { type: 'string', description: 'Mots à chercher dans le titre de l’album ou de la critique (œuvre, interprète, ensemble…)' },
        compositeur: { type: 'string', description: 'Nom du compositeur (ex. « Beethoven », « Hildegard von Bingen »)' },
        label: { type: 'string', description: 'Label discographique (ex. « Alpha Classics », « Harmonia Mundi »)' },
        annee: { type: 'integer', description: 'Année de publication de la critique' },
        distinction: { type: 'string', enum: ['millesime', 'joker'], description: 'Uniquement les disques distingués par la rédaction' },
        limite: { type: 'integer', minimum: 1, maximum: 30, default: 10 },
      },
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  {
    name: 'fiche_compositeur',
    title: 'Fiche d’un compositeur',
    description: 'Fiche Phono.Crescendo d’un compositeur : dates, nationalité, période, présentation, œuvres majeures, nombre de critiques Crescendo, Millésimes et Jokers, distinctions ICMA, et liste de ses disques critiqués (distingués en tête) avec liens vers les critiques.',
    inputSchema: {
      type: 'object',
      properties: {
        compositeur: { type: 'string', description: 'Nom (ex. « Clara Schumann ») ou identifiant Phono (ex. « johann-sebastian-bach »)' },
        limite: { type: 'integer', minimum: 1, maximum: 50, default: 15 },
      },
      required: ['compositeur'],
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  {
    name: 'palmares_crescendo',
    title: 'Palmarès Crescendo d’une année',
    description: 'Millésimes (la sélection annuelle des meilleurs enregistrements selon la rédaction de Crescendo Magazine) et Jokers (coups de cœur) d’une année, avec liens vers les critiques.',
    inputSchema: {
      type: 'object',
      properties: { annee: { type: 'integer', description: 'Année (ex. 2025)' } },
      required: ['annee'],
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  {
    name: 'palmares_icma',
    title: 'Palmarès des ICMA',
    description: 'Palmarès des International Classical Music Awards (ICMA, depuis 2011), dont Crescendo Magazine est membre du jury : prix spéciaux et enregistrements primés, par année ou pour un compositeur, avec lien vers la critique Crescendo quand le disque a été chroniqué.',
    inputSchema: {
      type: 'object',
      properties: {
        annee: { type: 'integer', minimum: 2011, description: 'Année du palmarès' },
        compositeur: { type: 'string', description: 'Nom d’un compositeur : ses disques primés aux ICMA, toutes années' },
      },
    },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
]

async function call(name, args) {
  if (name === 'chercher_critiques') {
    const limite = borne(args.limite, 1, 30, 10)
    let q = supabase.from('albums').select(ALBUM_FIELDS, { count: 'exact' })
    let compositeur = null
    if (args.compositeur) {
      const r = await trouverCompositeur(args.compositeur)
      if (!r.c) return inconnu(args.compositeur, r.suggestions)
      compositeur = r.c
      q = q.contains('composers', [r.c.name])
    }
    if (args.texte) {
      const t = String(args.texte).replace(/[,()%]/g, ' ').trim()
      if (t) q = q.or(`title.ilike.%${t}%,article_title.ilike.%${t}%`)
    }
    if (args.label) q = q.ilike('label', `%${String(args.label).replace(/[%,]/g, ' ').trim()}%`)
    if (args.annee) q = q.gte('published_at', `${args.annee}-01-01`).lte('published_at', `${args.annee}-12-31`)
    if (args.distinction === 'millesime') q = q.not('millesime_annee', 'is', null)
    if (args.distinction === 'joker') q = q.eq('is_joker', true)
    const { data, count, error } = await q.order('published_at', { ascending: false, nullsFirst: false }).limit(limite)
    if (error) return err('Erreur de recherche : ' + error.message)
    const albums = data || []
    if (!albums.length) return ok('Aucune critique ne correspond à ces critères.', { total: 0, critiques: [] })
    return ok(`${count} critique(s) Crescendo trouvée(s)${count > albums.length ? `, les ${albums.length} plus récentes` : ''} :\n` +
      albums.map(ligneAlbum).join('\n') + (compositeur ? `\nFiche du compositeur : ${ficheUrl(compositeur)}` : ''),
      { total: count, critiques: albums.map(albumJson) })
  }

  if (name === 'fiche_compositeur') {
    const limite = borne(args.limite, 1, 50, 15)
    const { c, suggestions } = await trouverCompositeur(args.compositeur, 'id, name, born, died, nationality, period, description, key_works')
    if (!c) return inconnu(args.compositeur, suggestions)
    const [{ data }, icmaAwards] = await Promise.all([
      supabase.from('albums').select(ALBUM_FIELDS).contains('composers', [c.name])
        .order('published_at', { ascending: false, nullsFirst: false }),
      getIcmaAwardsForComposer(c.name).catch(() => []),
    ])
    const albums = data || []
    const rang = a => (a.millesime_annee ? 0 : a.is_joker ? 1 : 2)
    const tries = [...albums].sort((a, b) => rang(a) - rang(b))
    const nbM = albums.filter(a => a.millesime_annee).length
    const nbJ = albums.filter(a => a.is_joker).length
    const oeuvres = Array.isArray(c.key_works) ? c.key_works : []
    const texte = [
      `${c.name} (${c.born || '?'}–${c.died || ''})${c.nationality ? `, ${c.nationality}` : ''}${c.period ? `, ${c.period}` : ''}`,
      c.description || null,
      oeuvres.length ? `Œuvres majeures : ${oeuvres.join(', ')}` : null,
      `${albums.length} disque(s) critiqué(s) par Crescendo, dont ${nbM} Millésime(s) et ${nbJ} Joker(s).`,
      tries.slice(0, limite).map(ligneAlbum).join('\n') || null,
      icmaAwards.length ? `Distinctions ICMA :\n` + icmaAwards.map(a => `- ${a.year} — ${a.album_title || a.laureate_name} — ${a.icma_categories?.label_fr || ''}` +
        (ICMA_CRITIQUES[a.id] ? ` — critique Crescendo : ${ICMA_CRITIQUES[a.id]}` : '')).join('\n') : null,
      `Fiche complète : ${ficheUrl(c)}`,
    ].filter(Boolean).join('\n\n')
    return ok(texte, {
      compositeur: c.name, fiche: ficheUrl(c), naissance: c.born || null, mort: c.died || null,
      nationalite: c.nationality || null, periode: c.period || null, oeuvres_majeures: oeuvres,
      total_critiques: albums.length, millesimes: nbM, jokers: nbJ,
      critiques: tries.slice(0, limite).map(albumJson),
      icma: icmaAwards.map(a => ({ annee: a.year, titre: a.album_title || a.laureate_name, categorie: a.icma_categories?.label_fr, critique_url: ICMA_CRITIQUES[a.id] || null })),
    })
  }

  if (name === 'palmares_crescendo') {
    const y = parseInt(args.annee, 10)
    if (!y) return err('Indiquez une année (ex. 2025).')
    const [mRes, jRes] = await Promise.all([
      supabase.from('albums').select(ALBUM_FIELDS).eq('millesime_annee', y).order('millesime_label'),
      supabase.from('albums').select(ALBUM_FIELDS).eq('is_joker', true)
        .gte('published_at', `${y}-01-01`).lte('published_at', `${y}-12-31`).order('published_at', { ascending: false }),
    ])
    const m = mRes.data || []
    const j = jRes.data || []
    if (!m.length && !j.length) return ok(`Aucun Millésime ni Joker enregistré pour ${y}.`, { annee: y, millesimes: [], jokers: [] })
    return ok(`Palmarès Crescendo ${y} : ${m.length} Millésime(s), ${j.length} Joker(s).` +
      (m.length ? `\n\nMillésimes ${y} :\n` + m.map(ligneAlbum).join('\n') : '') +
      (j.length ? `\n\nJokers ${y} :\n` + j.map(ligneAlbum).join('\n') : '') +
      `\n\nPage : ${SITE_URL}/palmares/${y}`,
      { annee: y, millesimes: m.map(albumJson), jokers: j.map(albumJson) })
  }

  if (name === 'palmares_icma') {
    let awards
    if (args.compositeur) {
      awards = await getIcmaAwardsForComposer(args.compositeur)
      if (args.annee) awards = awards.filter(a => a.year === Number(args.annee))
    } else if (args.annee) {
      awards = await getIcmaAwards(Number(args.annee))
    } else {
      const { data } = await icma.from('icma_awards').select('year').order('year', { ascending: false }).limit(1)
      awards = data?.[0] ? await getIcmaAwards(data[0].year) : []
    }
    if (!awards.length) return ok('Aucun prix ICMA ne correspond.', { prix: [] })
    const ligne = a => {
      const comp = (a.icma_awards_composers || []).map(x => x.icma_persons?.name).filter(Boolean)
      const interp = (a.icma_awards_performers || []).map(x => x.icma_persons?.name).filter(Boolean)
      return `- ${a.year} · ${a.icma_categories?.label_fr || a.icma_categories?.label_en} : ${a.laureate_name || a.album_title}` +
        (a.laureate_name && a.album_title ? ` (${a.album_title})` : '') +
        (comp.length ? ` — ${comp.join(', ')}` : '') + (interp.length ? ` — ${interp.join(', ')}` : '') +
        (a.icma_labels?.name ? ` — ${a.icma_labels.name}` : '') +
        (ICMA_CRITIQUES[a.id] ? ` — critique Crescendo : ${ICMA_CRITIQUES[a.id]}` : '')
    }
    return ok(`${awards.length} prix ICMA :\n` + awards.map(ligne).join('\n') + `\n\nPalmarès complet : ${SITE_URL}/icma`, {
      prix: awards.map(a => ({
        annee: a.year, categorie: a.icma_categories?.label_fr, laureat: a.laureate_name, album: a.album_title,
        label: a.icma_labels?.name || null, critique_crescendo: ICMA_CRITIQUES[a.id] || null,
      })),
    })
  }
  return null
}

const INSTRUCTIONS = 'Phono.Crescendo est la base des critiques de disques de musique classique de Crescendo Magazine ' +
  '(magazine indépendant belge, depuis 1993) : plus de 5 000 critiques signées et datées, les Millésimes et Jokers de la rédaction, ' +
  'et le palmarès des ICMA. Citez Crescendo Magazine avec le lien vers la critique quand vous utilisez ces données.'

async function handle(msg) {
  const { id, method, params } = msg || {}
  const reply = result => ({ jsonrpc: '2.0', id, result })
  const fail = (code, message) => ({ jsonrpc: '2.0', id: id ?? null, error: { code, message } })
  if (!msg || msg.jsonrpc !== '2.0' || typeof method !== 'string') return fail(-32600, 'Invalid Request')
  if (id === undefined) return null // notification : pas de réponse
  switch (method) {
    case 'initialize': {
      const asked = params?.protocolVersion
      return reply({
        protocolVersion: VERSIONS.includes(asked) ? asked : VERSIONS[0],
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: 'phono-crescendo', title: 'Phono.Crescendo — Crescendo Magazine', version: '1.0.0', websiteUrl: SITE_URL },
        instructions: INSTRUCTIONS,
      })
    }
    case 'ping': return reply({})
    case 'tools/list': return reply({ tools: TOOLS })
    case 'tools/call': {
      const name = params?.name
      if (!TOOLS.some(t => t.name === name)) return fail(-32602, 'Outil inconnu : ' + name)
      try { return reply(await call(name, params?.arguments || {})) }
      catch (e) { return reply(err('Erreur interne de Phono.Crescendo : ' + e.message)) }
    }
    default: return fail(-32601, 'Method not found: ' + method)
  }
}

export const MCP_TOOL_NAMES = TOOLS.map(t => t.name)

/** Traite un message JSON-RPC ou un lot ; renvoie null s'il n'y avait que des notifications. */
export async function handleMcp(body) {
  const batch = Array.isArray(body)
  const out = (await Promise.all((batch ? body : [body]).map(handle))).filter(Boolean)
  if (!out.length) return null
  return batch ? out : out[0]
}

