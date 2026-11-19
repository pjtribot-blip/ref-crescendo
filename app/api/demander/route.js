import { CHAT_TOOLS, runTool } from '@/lib/mcp'
import { SITE_URL } from '@/lib/site'

// Assistant « Demandez à Phono » : un modèle (DeepSeek V4 Pro via OpenRouter, comme Ravel Studies)
// qui répond aux questions des visiteurs en interrogeant la base avec les outils du serveur MCP.
// Variables Vercel : CHAT_API_KEY (clé OpenRouter, obligatoire), CHAT_MODEL, CHAT_API_URL (facultatives).
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const API_URL = (process.env.CHAT_API_URL || 'https://openrouter.ai/api/v1').replace(/\/+$/, '')
const MODEL = process.env.CHAT_MODEL || 'deepseek/deepseek-v4-pro'
const MAX_HISTORY = 8
const MAX_TOURS = 5 // appels d'outils successifs au plus par question

const SYSTEME = `Tu es l'assistant de Phono.Crescendo (${SITE_URL}), la base des critiques de disques de musique classique de Crescendo Magazine, magazine indépendant belge fondé en 1993 : plus de 5 000 critiques, les Millésimes (sélection annuelle des meilleurs enregistrements) et Jokers (coups de cœur) de la rédaction, et le palmarès des ICMA.

Règles :
- Pour toute question sur des disques, compositeurs, labels, distinctions : utilise TOUJOURS les outils avant de répondre. Ne cite jamais un disque, une critique ou une distinction qui ne figure pas dans les résultats des outils.
- Ne garde que les disques qui correspondent VRAIMENT à la question (bon compositeur, bon interprète, bonne œuvre) : écarte les résultats hors sujet plutôt que de les citer. Pour un chef, soliste, orchestre ou ensemble, utilise le critère interprete (essaie aussi texte si rien ne sort).
- N'ajoute aucune information extérieure aux résultats (pas de chef, d'orchestre, de date ou de détail que les outils n'ont pas donnés).
- Tu ne connais que les titres, labels, dates et distinctions, pas le texte des critiques : ne prête jamais d'avis ou de jugement au critique. Invite à lire la critique complète.
- Donne chaque disque avec son lien vers la critique, en Markdown : [titre](url). Ajoute le lien vers la fiche compositeur quand il y en a une.
- Mets en avant les Millésimes et Jokers quand on te demande un conseil, en expliquant que ce sont les distinctions de la rédaction.
- Si rien ne correspond, dis-le simplement et propose une autre piste (autre orthographe, compositeur proche, recherche sur le site).
- Réponds dans la langue de la question, brièvement (10 disques au plus), sans tableau.
- Tu ne parles que de musique classique et de Crescendo ; décline poliment les autres sujets.`

// Limite par visiteur (mémoire de l'instance : protection simple, en plus du plafond de la clé OpenRouter)
const VISITES = new Map()
function trop(ip) {
  const now = Date.now()
  const liste = (VISITES.get(ip) || []).filter(t => now - t < 3600_000)
  liste.push(now)
  VISITES.set(ip, liste)
  if (VISITES.size > 5000) VISITES.clear()
  return liste.filter(t => now - t < 60_000).length > 6 || liste.length > 40
}

async function modele(messages, cle, avecOutils) {
  const r = await fetch(API_URL + '/chat/completions', {
    method: 'POST',
    headers: { authorization: 'Bearer ' + cle, 'content-type': 'application/json', 'HTTP-Referer': SITE_URL, 'X-Title': 'Phono.Crescendo' },
    body: JSON.stringify({
      model: MODEL, max_tokens: 2500, temperature: 0.2,
      messages: [{ role: 'system', content: SYSTEME }, ...messages],
      ...(avecOutils ? { tools: CHAT_TOOLS, tool_choice: 'auto' } : {}),
      ...(process.env.CHAT_MODEL ? {} : { reasoning: { effort: 'none', exclude: true } }),
    }),
  })
  if (!r.ok) throw Object.assign(new Error('amont'), { status: r.status, detail: (await r.text()).slice(0, 300) })
  const d = await r.json()
  return d.choices?.[0]?.message || {}
}

const json = (status, obj) => Response.json(obj, { status, headers: { 'Cache-Control': 'no-store' } })

export async function POST(request) {
  const cle = process.env.CHAT_API_KEY
  if (!cle) return json(500, { error: 'cle_api_absente' })
  const ip = (request.headers.get('x-forwarded-for') || '?').split(',')[0].trim()
  if (trop(ip)) return json(429, { error: 'trop_de_requetes' })

  let body
  try { body = await request.json() } catch { return json(400, { error: 'json' }) }
  const historique = (Array.isArray(body?.messages) ? body.messages : [])
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-MAX_HISTORY).map(m => ({ role: m.role, content: m.content.slice(0, 2000) }))
  if (!historique.length || historique.at(-1).role !== 'user') return json(400, { error: 'question_vide' })
  if (historique.at(-1).content.length > 1000) return json(400, { error: 'question_trop_longue' })

  const messages = [...historique]
  try {
    for (let tour = 0; tour <= MAX_TOURS; tour++) {
      const m = await modele(messages, cle, tour < MAX_TOURS)
      const appels = m.tool_calls || []
      if (!appels.length) {
        const reponse = String(m.content || '').trim()
        if (!reponse) throw Object.assign(new Error('reponse_vide'), { detail: 'réponse vide' })
        return json(200, { reponse })
      }
      messages.push({ role: 'assistant', content: m.content || '', tool_calls: appels })
      const resultats = await Promise.all(appels.map(async a => {
        let args = {}
        try { args = JSON.parse(a.function?.arguments || '{}') } catch {}
        return { role: 'tool', tool_call_id: a.id, content: (await runTool(a.function?.name, args)).slice(0, 12000) }
      }))
      messages.push(...resultats)
    }
    return json(502, { error: 'trop_d_etapes' })
  } catch (e) {
    return json(502, { error: 'api_amont', status: e.status || null, detail: e.detail || String(e.message || e) })
  }
}
