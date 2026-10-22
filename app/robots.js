import { SITE_URL } from '@/lib/site'

// Politique robots Crescendo, révisée le 22 octobre 2026 (remplace celle du 18 mai) :
// - on bloque l'ENTRAÎNEMENT des IA (aspiration de la base sans attribution) ;
// - on autorise la RECHERCHE et la CITATION par les IA (réponse à une question
//   d'utilisateur, avec lien vers la page) : c'est ce qui fait de Phono.Crescendo
//   une source citée quand on demande « quel est le meilleur enregistrement de… ».
// Contenu sous licence CC BY-NC-SA 4.0.

// Robots d'entraînement : bloqués
const TRAINING = [
  'GPTBot', // OpenAI, entraînement
  'CCBot', // Common Crawl
  'Google-Extended', // entraînement Gemini (Googlebot reste autorisé)
  'Applebot-Extended',
  'Bytespider', // ByteDance
  'anthropic-ai', // Anthropic, anciens robots d'entraînement
  'Meta-ExternalAgent', 'FacebookBot',
  'cohere-ai', 'cohere-training-data-crawler',
  'Diffbot',
  'Omgilibot', 'Omgili',
]

// Moteurs de recherche et IA qui citent leurs sources avec un lien : autorisés
const ALLOWED = [
  'Googlebot', 'Bingbot', 'DuckDuckBot', 'Qwantify', 'EcosiaBot',
  'YandexBot', 'Baiduspider',
  'OAI-SearchBot', 'ChatGPT-User', // recherche ChatGPT, consultation à la demande
  'PerplexityBot', 'Perplexity-User',
  'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
]

export default function robots() {
  return {
    rules: [
      { userAgent: TRAINING, disallow: '/' },
      { userAgent: ALLOWED, allow: '/' },
      { userAgent: '*', allow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
