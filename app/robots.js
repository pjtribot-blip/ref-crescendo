const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ref.crescendo-magazine.be'

// Politique robots universelle Crescendo (18 mai 2026) :
// protection anti-pillage IA + autorisation des moteurs SEO légitimes.
// Contenu sous licence CC BY-NC-SA 4.0.

// Scrapeurs IA qui pillent sans attribution ni trafic retour
const BLOCKED = [
  'GPTBot', 'ChatGPT-User', 'OAI-SearchBot', // OpenAI
  'PerplexityBot',
  'CCBot', // Common Crawl
  'Bytespider', // ByteDance
  'anthropic-ai', // Anthropic (anciens crawlers d'entraînement)
  'Google-Extended', // entraînement Gemini (Googlebot reste autorisé)
  'Applebot-Extended',
  'Meta-ExternalAgent', 'FacebookBot',
  'cohere-ai',
  'Diffbot',
  'Omgilibot', 'Omgili',
]

// Moteurs qui apportent du trafic avec attribution
const ALLOWED = [
  'Googlebot', 'Bingbot', 'DuckDuckBot', 'Qwantify', 'EcosiaBot',
  'YandexBot', 'Baiduspider',
  'ClaudeBot', // cite les sources avec lien actif
]

export default function robots() {
  return {
    rules: [
      { userAgent: BLOCKED, disallow: '/' },
      { userAgent: ALLOWED, allow: '/' },
      { userAgent: '*', allow: '/' },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
