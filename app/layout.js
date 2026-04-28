import './globals.css'
import Header from './_components/Header'
import Footer from './_components/Footer'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ref.crescendo-magazine.be'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Phono.Crescendo — Base de données critiques phonographiques',
    template: '%s · Phono.Crescendo',
  },
  description: "Base de données des critiques phonographiques de Crescendo Magazine : 5190 albums, 608 compositeurs, 68 Millésimes, 32 ans d'édition critique depuis 1993",
  openGraph: {
    type: 'website',
    locale: 'fr_BE',
    siteName: 'Phono.Crescendo',
    title: 'Phono.Crescendo — Base de données critiques phonographiques',
    description: "Base de données des critiques phonographiques de Crescendo Magazine : 5190 albums, 608 compositeurs, 68 Millésimes.",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Phono.Crescendo',
    description: 'La base de données des critiques phonographiques de Crescendo Magazine.',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-stone-50 min-h-screen">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
