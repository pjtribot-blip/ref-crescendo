'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import * as Dialog from '@radix-ui/react-dialog'

const MIN_Q = 2
const DEBOUNCE_MS = 200

function useSearchResults(query) {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const abortRef = useRef(null)

  useEffect(() => {
    const q = query.trim()
    if (q.length < MIN_Q) {
      setResults(null)
      setLoading(false)
      return
    }
    setLoading(true)
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal })
        if (res.ok) setResults(await res.json())
      } catch (err) {
        if (err.name !== 'AbortError') console.error('[search]', err)
      } finally {
        setLoading(false)
      }
    }, DEBOUNCE_MS)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  return { results, loading }
}

export default function SearchBox() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [desktopOpen, setDesktopOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const desktopInputRef = useRef(null)

  const { results, loading } = useSearchResults(query)

  const flatItems = useMemo(() => {
    if (!results) return []
    return [
      ...results.compositeurs.map(c => ({ type: 'compositeur', ...c })),
      ...results.labels.map(l => ({ type: 'label', ...l })),
      ...results.albums.map(a => ({ type: 'album', ...a })),
    ]
  }, [results])

  // Reset active item quand les résultats changent
  useEffect(() => { setActiveIndex(-1) }, [results])

  const closeEverything = useCallback(() => {
    setDesktopOpen(false)
    setMobileOpen(false)
  }, [])

  const submitAll = useCallback(() => {
    const q = query.trim()
    if (q.length < MIN_Q) return
    router.push(`/recherche?q=${encodeURIComponent(q)}`)
    setQuery('')
    closeEverything()
  }, [query, router, closeEverything])

  const navigateToItem = useCallback((item) => {
    if (item.type === 'compositeur') {
      router.push(`/compositeurs/${item.id}`)
    } else if (item.type === 'label') {
      router.push(`/albums?label=${encodeURIComponent(item.name)}`)
    } else if (item.type === 'album' && item.critique_url) {
      window.open(item.critique_url, '_blank', 'noopener,noreferrer')
    }
    setQuery('')
    closeEverything()
  }, [router, closeEverything])

  // Raccourci global Cmd/Ctrl + K
  useEffect(() => {
    const onKey = (e) => {
      const k = e.key?.toLowerCase()
      if ((e.metaKey || e.ctrlKey) && k === 'k') {
        e.preventDefault()
        if (typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches) {
          desktopInputRef.current?.focus()
          setDesktopOpen(true)
        } else {
          setMobileOpen(true)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const onInputKeyDown = useCallback((e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(flatItems.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(-1, i - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && flatItems[activeIndex]) {
        navigateToItem(flatItems[activeIndex])
      } else {
        submitAll()
      }
    } else if (e.key === 'Escape') {
      closeEverything()
      desktopInputRef.current?.blur()
    }
  }, [flatItems, activeIndex, navigateToItem, submitAll, closeEverything])

  const showDesktopDropdown = desktopOpen && query.trim().length >= MIN_Q

  return (
    <>
      {/* Desktop : input inline + dropdown absolu */}
      <div className="relative hidden md:block w-56">
        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400">
          <SearchIcon size={14} />
        </span>
        <input
          ref={desktopInputRef}
          type="search"
          value={query}
          placeholder="Rechercher…  ⌘K"
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setDesktopOpen(true)}
          onBlur={() => setTimeout(() => setDesktopOpen(false), 150)}
          onKeyDown={onInputKeyDown}
          aria-label="Recherche"
          className="w-full pl-8 pr-3 py-1.5 text-sm border border-stone-300 rounded-lg bg-white hover:border-stone-400 focus:border-stone-500 focus:outline-none transition-colors"
        />
        {showDesktopDropdown && (
          <div
            className="absolute top-full right-0 mt-2 w-96 max-w-[90vw] bg-white border border-stone-200 rounded-lg shadow-lg z-50 overflow-hidden"
            onMouseDown={e => e.preventDefault()}
          >
            <SearchDropdown
              query={query}
              results={results}
              loading={loading}
              activeIndex={activeIndex}
              onSelect={navigateToItem}
              onSeeAll={submitAll}
            />
          </div>
        )}
      </div>

      {/* Mobile : icône qui ouvre un Dialog plein écran */}
      <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <Dialog.Trigger asChild>
          <button
            className="md:hidden p-2 text-stone-700 hover:bg-stone-100 rounded transition-colors"
            aria-label="Rechercher"
          >
            <SearchIcon size={22} />
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
          <Dialog.Content
            className="fixed inset-0 z-50 bg-white flex flex-col"
            onKeyDown={onInputKeyDown}
          >
            <Dialog.Title className="sr-only">Recherche</Dialog.Title>
            <div className="flex items-center gap-2 p-3 border-b border-stone-200 shrink-0">
              <span className="text-stone-500">
                <SearchIcon size={20} />
              </span>
              <input
                autoFocus
                type="search"
                value={query}
                placeholder="Compositeur, album, label…"
                onChange={e => setQuery(e.target.value)}
                className="flex-1 px-2 py-2 text-base text-stone-800 focus:outline-none"
                aria-label="Recherche"
              />
              <Dialog.Close asChild>
                <button className="p-2 text-sm text-stone-600 hover:text-stone-900" aria-label="Fermer">
                  Fermer
                </button>
              </Dialog.Close>
            </div>
            <div className="flex-1 overflow-y-auto">
              {query.trim().length >= MIN_Q ? (
                <SearchDropdown
                  query={query}
                  results={results}
                  loading={loading}
                  activeIndex={activeIndex}
                  onSelect={navigateToItem}
                  onSeeAll={submitAll}
                />
              ) : (
                <p className="p-6 text-sm text-stone-500 text-center">
                  Tapez au moins {MIN_Q} caractères — compositeur, album, label.
                </p>
              )}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}

// ----------------------------------------------------------------------
// Sous-composants
// ----------------------------------------------------------------------

function SearchDropdown({ query, results, loading, activeIndex, onSelect, onSeeAll }) {
  if (loading && !results) {
    return <p className="p-4 text-sm text-stone-500">Recherche…</p>
  }
  if (!results) return null

  const { compositeurs, labels, albums } = results
  const total = compositeurs.length + labels.length + albums.length

  if (total === 0) {
    return (
      <div className="p-4 text-sm text-stone-500">
        Aucun résultat pour <span className="font-medium text-stone-800">« {query} »</span>.
        <button
          type="button"
          onMouseDown={e => { e.preventDefault(); onSeeAll() }}
          className="block mt-2 text-amber-700 hover:text-amber-900 underline underline-offset-2"
        >
          Voir la page de recherche complète →
        </button>
      </div>
    )
  }

  let idx = 0
  return (
    <div className="py-2">
      {compositeurs.length > 0 && (
        <Section title="Compositeurs">
          {compositeurs.map(c => {
            const i = idx++
            const dates = c.born && c.died ? `${c.born}–${c.died}` : c.born ? `n. ${c.born}` : ''
            const subtitle = [c.nationality, dates].filter(Boolean).join(' · ')
            return (
              <Item
                key={`c-${c.id}`}
                active={i === activeIndex}
                onClick={() => onSelect({ type: 'compositeur', ...c })}
                title={c.name}
                subtitle={subtitle}
              />
            )
          })}
        </Section>
      )}

      {labels.length > 0 && (
        <Section title="Labels">
          {labels.map(l => {
            const i = idx++
            const subtitle = `${l.count} album${l.count > 1 ? 's' : ''} chroniqué${l.count > 1 ? 's' : ''}`
            return (
              <Item
                key={`l-${l.name}`}
                active={i === activeIndex}
                onClick={() => onSelect({ type: 'label', ...l })}
                title={l.name}
                subtitle={subtitle}
              />
            )
          })}
        </Section>
      )}

      {albums.length > 0 && (
        <Section title="Albums">
          {albums.map(a => {
            const i = idx++
            const subtitle = [a.composer, a.label, a.year].filter(Boolean).join(' · ')
            return (
              <Item
                key={`a-${a.id}`}
                active={i === activeIndex}
                onClick={() => onSelect({ type: 'album', ...a })}
                title={a.title}
                subtitle={subtitle}
                cover={a.cover_url}
              />
            )
          })}
        </Section>
      )}

      <div className="border-t border-stone-200 mt-1">
        <button
          type="button"
          onMouseDown={e => { e.preventDefault(); onSeeAll() }}
          className="w-full text-left px-3 py-2 text-sm text-amber-700 hover:bg-stone-50 hover:text-amber-900 transition-colors"
        >
          Voir tous les résultats pour <span className="font-medium">« {query} »</span> →
        </button>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="px-2 mb-1">
      <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-stone-500">
        {title}
      </p>
      {children}
    </div>
  )
}

function Item({ active, onClick, title, subtitle, cover }) {
  return (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick() }}
      className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded transition-colors ${
        active ? 'bg-stone-100' : 'hover:bg-stone-50'
      }`}
    >
      {cover !== undefined && (
        cover
          ? <img src={cover} alt="" className="w-8 h-8 object-cover rounded shrink-0" />
          : <div className="w-8 h-8 bg-stone-100 rounded shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-stone-900 truncate">{title}</p>
        {subtitle && <p className="text-xs text-stone-500 truncate">{subtitle}</p>}
      </div>
    </button>
  )
}

function SearchIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3-3" />
    </svg>
  )
}
