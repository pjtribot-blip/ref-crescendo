'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import * as Dialog from '@radix-ui/react-dialog'
import * as Collapsible from '@radix-ui/react-collapsible'
import SearchBox from './SearchBox'

const NAV_GROUPS = [
  {
    label: 'Parcourir',
    items: [
      { href: '/compositeurs', label: 'Compositeurs' },
      { href: '/interpretes', label: 'Interprètes' },
      { href: '/albums', label: 'Albums' },
      { href: '/labels', label: 'Labels' },
    ],
  },
  {
    label: 'Sélections',
    items: [
      { href: '/millesimes', label: 'Millésimes' },
      { href: '/jokers', label: 'Jokers' },
      { href: '/palmares', label: 'Palmarès' },
    ],
  },
  {
    label: 'Focus',
    items: [
      { href: '/compositrices', label: 'Compositrices' },
      { href: '/millesimes/matrimoine', label: 'Matrimoine' },
      { href: '/belgique', label: 'Belgique' },
      { href: '/premieres', label: 'Premières mondiales' },
    ],
  },
]

const DIRECT_LINKS = [
  { href: '/statistiques', label: 'Chiffres' },
]

function isActive(href, pathname) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(href + '/')
}

function groupIsActive(group, pathname) {
  return group.items.some(item => isActive(item.href, pathname))
}

const LINK_BASE = 'text-sm text-stone-600 hover:text-stone-900 transition-colors'
const LINK_ACTIVE = 'font-semibold text-stone-900 underline underline-offset-4 decoration-stone-400'

function ChevronDown({ className = '' }) {
  return (
    <svg
      className={`w-3 h-3 opacity-60 transition-transform ${className}`}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="m3 4.5 3 3 3-3" />
    </svg>
  )
}

function SearchIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3-3" />
    </svg>
  )
}

export default function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const closeMobile = () => setMobileOpen(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-stone-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-1.5 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition-colors text-sm font-medium shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Phono.Crescendo
        </Link>

        {/* Bloc droit : nav desktop + SearchBox (toutes tailles) + Magazine + burger */}
        <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-5">
          <NavigationMenu.Root delayDuration={100} className="relative">
            <NavigationMenu.List className="flex items-center gap-5">
              {NAV_GROUPS.map(group => {
                const active = groupIsActive(group, pathname)
                return (
                  <NavigationMenu.Item key={group.label} className="relative">
                    <NavigationMenu.Trigger
                      className={`${LINK_BASE} inline-flex items-center gap-1 data-[state=open]:text-stone-900 ${active ? LINK_ACTIVE : ''}`}
                    >
                      {group.label}
                      <ChevronDown className="group-data-[state=open]:rotate-180 data-[state=open]:rotate-180" />
                    </NavigationMenu.Trigger>
                    <NavigationMenu.Content
                      className="absolute top-full left-0 mt-2 min-w-[13rem] bg-white border border-stone-200 rounded-lg shadow-lg p-2 z-10"
                    >
                      <ul className="flex flex-col">
                        {group.items.map(item => {
                          const itemActive = isActive(item.href, pathname)
                          return (
                            <li key={item.href}>
                              <NavigationMenu.Link asChild>
                                <Link
                                  href={item.href}
                                  className={`block px-3 py-2 rounded text-sm transition-colors ${
                                    itemActive
                                      ? 'font-semibold text-stone-900 bg-stone-100'
                                      : 'text-stone-700 hover:bg-stone-50 hover:text-stone-900'
                                  }`}
                                >
                                  {item.label}
                                </Link>
                              </NavigationMenu.Link>
                            </li>
                          )
                        })}
                      </ul>
                    </NavigationMenu.Content>
                  </NavigationMenu.Item>
                )
              })}
            </NavigationMenu.List>
          </NavigationMenu.Root>

          {DIRECT_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`${LINK_BASE} ${isActive(link.href, pathname) ? LINK_ACTIVE : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* SearchBox : visible toutes tailles (input inline desktop, icône+Dialog mobile) */}
        <SearchBox />

        <a
          href="https://www.crescendo-magazine.be"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex px-3 py-1.5 border border-stone-300 rounded-lg text-sm text-stone-700 hover:border-stone-500 hover:text-stone-900 transition-colors"
        >
          Magazine →
        </a>

        {/* Mobile burger */}
        <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
          <Dialog.Trigger asChild>
            <button
              className="md:hidden p-2 text-stone-700 hover:bg-stone-100 rounded transition-colors"
              aria-label="Ouvrir le menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/30 z-50" />
            <Dialog.Content className="fixed top-0 right-0 bottom-0 w-80 max-w-[90vw] bg-white z-50 shadow-xl overflow-y-auto flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-stone-200">
                <Dialog.Title className="text-sm font-semibold text-stone-800">Navigation</Dialog.Title>
                <Dialog.Close
                  className="p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                  aria-label="Fermer le menu"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </Dialog.Close>
              </div>
              <div className="flex-1 p-4 space-y-1">
                {NAV_GROUPS.map(group => {
                  const active = groupIsActive(group, pathname)
                  return (
                    <Collapsible.Root key={group.label} defaultOpen={active}>
                      <Collapsible.Trigger className="w-full flex items-center justify-between px-3 py-2 rounded text-sm font-medium text-stone-800 hover:bg-stone-100 transition-colors data-[state=open]:bg-stone-50 [&[data-state=open]>svg]:rotate-180">
                        {group.label}
                        <ChevronDown />
                      </Collapsible.Trigger>
                      <Collapsible.Content className="pl-4 py-1">
                        <ul className="flex flex-col">
                          {group.items.map(item => {
                            const itemActive = isActive(item.href, pathname)
                            return (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  onClick={closeMobile}
                                  className={`block px-3 py-2 rounded text-sm transition-colors ${
                                    itemActive
                                      ? 'font-semibold text-stone-900 bg-stone-100'
                                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                                  }`}
                                >
                                  {item.label}
                                </Link>
                              </li>
                            )
                          })}
                        </ul>
                      </Collapsible.Content>
                    </Collapsible.Root>
                  )
                })}

                <hr className="border-stone-200 my-3" />

                {DIRECT_LINKS.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobile}
                    className={`block px-3 py-2 rounded text-sm transition-colors ${
                      isActive(link.href, pathname)
                        ? 'font-semibold text-stone-900 bg-stone-100'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/recherche"
                  onClick={closeMobile}
                  className={`flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                    isActive('/recherche', pathname)
                      ? 'font-semibold text-stone-900 bg-stone-100'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <SearchIcon size={16} />
                  Recherche
                </Link>
              </div>

              <div className="p-4 border-t border-stone-200">
                <a
                  href="https://www.crescendo-magazine.be"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobile}
                  className="block px-3 py-2 border border-stone-300 rounded-lg text-sm text-stone-700 hover:border-stone-500 hover:text-stone-900 transition-colors text-center"
                >
                  Magazine →
                </a>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        </div>
      </div>
    </nav>
  )
}
