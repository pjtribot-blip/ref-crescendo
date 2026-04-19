'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

const STORAGE_KEY = 'hideUnlabeledAlbums'

/**
 * Toggle instantané « Masquer les albums sans label ».
 *
 * Source de vérité : le paramètre d'URL `hide` (absent = défaut activé).
 * Persistance : localStorage (clé `hideUnlabeledAlbums` = 'true' | 'false').
 *
 * Synchronisation au montage : si l'URL n'a pas explicitement `hide`, on
 * applique la préférence stockée en localStorage via `router.replace`
 * (pas d'ajout à l'historique). Si l'URL est explicite, on la respecte.
 *
 * Le serveur rend par défaut `hide = true` en l'absence du paramètre ;
 * le flash éventuel ne concerne que les utilisateurs qui ont désactivé
 * le toggle puis reviennent — durée < 100 ms après hydratation.
 */
export default function HideUnlabeledToggle({ hide, count }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const syncedRef = useRef(false)

  useEffect(() => {
    if (syncedRef.current) return
    syncedRef.current = true
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === null) return
      if (searchParams.get('hide') !== null) return
      const storedHide = stored === 'true'
      if (storedHide === hide) return
      const params = new URLSearchParams(searchParams.toString())
      if (storedHide) {
        params.delete('hide')
      } else {
        params.set('hide', '0')
      }
      params.delete('page')
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname)
    } catch {
      // localStorage indisponible (SSR, mode privé strict) — ignorer
    }
  }, [hide, router, searchParams, pathname])

  const onChange = (e) => {
    const checked = e.target.checked
    try {
      localStorage.setItem(STORAGE_KEY, checked ? 'true' : 'false')
    } catch {}
    const params = new URLSearchParams(searchParams.toString())
    if (checked) {
      params.delete('hide')
    } else {
      params.set('hide', '0')
    }
    params.delete('page')
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <label className="inline-flex items-center gap-2 cursor-pointer text-stone-700 hover:text-stone-900 transition-colors">
        <input
          type="checkbox"
          checked={hide}
          onChange={onChange}
          className="rounded border-stone-300 text-stone-800 focus:ring-stone-500 focus:ring-offset-0"
        />
        Masquer les albums sans label
      </label>
      {typeof count === 'number' && (
        <span className="text-stone-500">
          · {count.toLocaleString('fr-FR')} album{count !== 1 ? 's' : ''}{hide ? ` affiché${count !== 1 ? 's' : ''}` : ''}
        </span>
      )}
    </div>
  )
}
