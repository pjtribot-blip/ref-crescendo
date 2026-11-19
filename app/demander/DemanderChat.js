'use client'

import { useState, useRef, useEffect } from 'react'

const EXEMPLES = [
  'Quels disques de Bach ont été distingués par Crescendo ?',
  'Les Millésimes de 2025',
  'Des disques de compositrices récemment chroniqués ?',
  'Quels enregistrements de Mahler avec Paavo Järvi ?',
]

const ERREURS = {
  trop_de_requetes: 'Trop de questions en peu de temps : réessayez dans une minute.',
  cle_api_absente: 'L’assistant n’est pas encore activé.',
}

// Rendu minimal et sûr du Markdown de la réponse : liens [texte](url), **gras**, listes, paragraphes.
function Ligne({ texte }) {
  const morceaux = []
  const re = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|\*\*([^*]+)\*\*|(https?:\/\/[^\s)]+)/g
  let i = 0, m
  while ((m = re.exec(texte))) {
    if (m.index > i) morceaux.push(texte.slice(i, m.index))
    if (m[1]) morceaux.push(<a key={m.index} href={m[2]} target="_blank" rel="noopener noreferrer" className="text-amber-800 underline decoration-amber-300 hover:decoration-amber-700">{m[1]}</a>)
    else if (m[3]) morceaux.push(<strong key={m.index} className="font-semibold"><Ligne texte={m[3]} /></strong>)
    else morceaux.push(<a key={m.index} href={m[4]} target="_blank" rel="noopener noreferrer" className="text-amber-800 underline break-all">{m[4]}</a>)
    i = m.index + m[0].length
  }
  if (i < texte.length) morceaux.push(texte.slice(i))
  return morceaux
}

function Reponse({ texte }) {
  const blocs = texte.split(/\n{2,}/)
  return blocs.map((bloc, b) => {
    const lignes = bloc.split('\n').filter(l => l.trim())
    if (lignes.length && lignes.every(l => /^\s*([-*•]|\d+\.)\s+/.test(l))) {
      return (
        <ul key={b} className="list-disc pl-5 space-y-1 my-2">
          {lignes.map((l, k) => <li key={k}><Ligne texte={l.replace(/^\s*([-*•]|\d+\.)\s+/, '')} /></li>)}
        </ul>
      )
    }
    return <p key={b} className="my-2">{lignes.map((l, k) => <span key={k}>{k > 0 && <br />}<Ligne texte={l.replace(/^#+\s*/, '')} /></span>)}</p>
  })
}

export default function DemanderChat() {
  const [messages, setMessages] = useState([])
  const [question, setQuestion] = useState('')
  const [attente, setAttente] = useState(false)
  const [erreur, setErreur] = useState(null)
  const fin = useRef(null)

  useEffect(() => { fin.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [messages, attente])

  async function envoyer(texte) {
    const q = (texte ?? question).trim()
    if (!q || attente) return
    const suite = [...messages, { role: 'user', content: q }]
    setMessages(suite)
    setQuestion('')
    setErreur(null)
    setAttente(true)
    try {
      const r = await fetch('/api/demander', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: suite }),
      })
      const d = await r.json().catch(() => ({}))
      if (!r.ok || !d.reponse) throw new Error(ERREURS[d.error] || 'L’assistant n’a pas pu répondre. Réessayez.')
      setMessages([...suite, { role: 'assistant', content: d.reponse }])
    } catch (e) {
      setErreur(e.message)
    } finally {
      setAttente(false)
    }
  }

  return (
    <div>
      {messages.length === 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {EXEMPLES.map(e => (
            <button key={e} onClick={() => envoyer(e)} className="text-sm px-3 py-1.5 border border-stone-300 rounded-full text-stone-600 hover:border-stone-500 hover:text-stone-900 transition-colors text-left">
              {e}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-4 mb-6">
        {messages.map((m, i) => m.role === 'user' ? (
          <div key={i} className="flex justify-end">
            <p className="bg-stone-100 text-stone-800 rounded-2xl px-4 py-2 max-w-[85%] whitespace-pre-wrap">{m.content}</p>
          </div>
        ) : (
          <div key={i} className="text-stone-700 leading-relaxed border-l-2 border-amber-300 pl-4">
            <Reponse texte={m.content} />
          </div>
        ))}
        {attente && <p className="text-stone-400 text-sm italic pl-4">Recherche dans les critiques…</p>}
        {erreur && <p className="text-red-700 text-sm pl-4">{erreur}</p>}
        <div ref={fin} />
      </div>

      <form onSubmit={e => { e.preventDefault(); envoyer() }} className="flex gap-2 sticky bottom-4">
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          maxLength={1000}
          placeholder="Votre question (ex. quelle version des Goldberg écouter ?)"
          className="flex-1 border border-stone-300 rounded-lg px-4 py-2.5 bg-white text-stone-800 focus:outline-none focus:border-stone-500"
        />
        <button type="submit" disabled={attente || !question.trim()} className="px-4 py-2.5 rounded-lg bg-stone-800 text-white text-sm disabled:opacity-40 hover:bg-stone-700 transition-colors">
          Envoyer
        </button>
      </form>
      {messages.length > 0 && (
        <button onClick={() => { setMessages([]); setErreur(null) }} className="text-xs text-stone-400 hover:text-stone-600 mt-3">
          Nouvelle conversation
        </button>
      )}
    </div>
  )
}
