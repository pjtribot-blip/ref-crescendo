export function prestoUrl(title, composers) {
  const composer = Array.isArray(composers) ? (composers[0] || '') : (composers || '')
  const q = [title, composer].filter(Boolean).join(' ').trim()
  if (!q) return null
  return `https://streaming.prestomusic.com/search?searchType=works&q=${encodeURIComponent(q)}`
}

export function PrestoButton({ title, composers, className = '', size = 'sm' }) {
  const url = prestoUrl(title, composers)
  if (!url) return null
  const sizeClass = size === 'xs'
    ? 'px-2 py-0.5 text-[11px] gap-1'
    : 'px-2.5 py-1 text-xs gap-1.5'
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center bg-stone-100 hover:bg-stone-200 border border-stone-200 hover:border-stone-300 rounded text-stone-700 transition-colors ${sizeClass} ${className}`}
      aria-label={`Écouter ${title} sur Presto Music`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width={size === 'xs' ? 11 : 12} height={size === 'xs' ? 11 : 12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
      </svg>
      Écouter sur Presto →
    </a>
  )
}
