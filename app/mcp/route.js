import { handleMcp, MCP_TOOL_NAMES } from '@/lib/mcp'
import { SITE_URL } from '@/lib/site'

// Point d'entrée MCP : POST /mcp (JSON-RPC), lecture seule, sans clé.
// Ajouter SITE_URL/mcp comme connecteur dans Claude, ChatGPT, Copilot, Cursor…
export const dynamic = 'force-dynamic'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID',
  'Access-Control-Expose-Headers': 'Mcp-Session-Id',
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS })
}

export function GET(request) {
  // Pas de flux SSE (serveur sans état) ; visite dans un navigateur : petite explication
  if (/text\/event-stream/.test(request.headers.get('accept') || '')) {
    return new Response(null, { status: 405, headers: { ...CORS, Allow: 'POST, OPTIONS' } })
  }
  return new Response(
    'Serveur MCP de Phono.Crescendo (Crescendo Magazine).\n' +
    `Ajoutez cette adresse comme connecteur dans votre assistant IA : ${SITE_URL}/mcp\n` +
    `Outils : ${MCP_TOOL_NAMES.join(', ')}\n`,
    { status: 200, headers: { ...CORS, 'Content-Type': 'text/plain; charset=utf-8' } })
}

export async function POST(request) {
  let body
  try { body = await request.json() } catch { body = undefined }
  if (body === undefined || body === null) {
    return Response.json({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } }, { status: 400, headers: CORS })
  }
  const out = await handleMcp(body)
  if (!out) return new Response(null, { status: 202, headers: CORS }) // uniquement des notifications
  return Response.json(out, { headers: { ...CORS, 'Cache-Control': 'no-store' } })
}
