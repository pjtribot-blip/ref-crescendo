import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 mt-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 text-center space-y-3">
        <p className="text-sm text-stone-600 leading-relaxed max-w-3xl mx-auto">
          <strong className="text-stone-800">Phono.Crescendo</strong> — Une émanation de{' '}
          <a
            href="https://www.crescendo-magazine.be"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-700 hover:text-amber-900 underline underline-offset-2"
          >
            Crescendo Magazine
          </a>
          , média musical francophone basé en Belgique depuis 1993.
        </p>
        <p className="text-xs text-stone-500 italic">
          Fondé par Bernadette Beyne (1949-2018) et Michelle Debra (1950-2025).
        </p>
        <nav className="flex items-center justify-center gap-3 text-xs text-stone-600 pt-2">
          <Link href="/a-propos" className="hover:text-stone-900 underline underline-offset-2">
            À propos
          </Link>
          <span className="text-stone-300" aria-hidden="true">|</span>
          <a
            href="https://www.crescendo-magazine.be"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-stone-900 underline underline-offset-2"
          >
            Crescendo Magazine
          </a>
        </nav>
        <p className="text-xs text-stone-400 pt-1">
          © Crescendo Magazine 2026
        </p>
      </div>
    </footer>
  )
}
