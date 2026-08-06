'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { nav, type Locale } from '@/i18n/dictionary'

export default function Nav({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const items: [string, string][] = [
    ['', nav[locale].home],
    ['bio', nav[locale].bio],
    ['portafolio', nav[locale].portafolio],
    ['exposiciones', nav[locale].exposiciones],
    ['resenas', nav[locale].resenas],
    ['noticias', nav[locale].noticias],
    ['contacto', nav[locale].contacto],
  ]
  const otherLocale = locale === 'es' ? 'en' : 'es'
  const restOfPath = pathname.split('/').slice(2).join('/')

  return (
    <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
      <nav className="flex items-center justify-between px-6 md:px-10 py-6 text-white">
        <Link href={`/${locale}`} className="text-sm tracking-[0.2em] uppercase">
          Astrid Sommer
        </Link>
        <ul className="hidden md:flex gap-8 text-xs tracking-widest uppercase">
          {items.map(([href, label]) => (
            <li key={href}>
              <Link href={`/${locale}/${href}`.replace(/\/$/, '') || `/${locale}`}>{label}</Link>
            </li>
          ))}
        </ul>
        <Link href={`/${otherLocale}/${restOfPath}`} className="text-xs tracking-widest uppercase">
          {otherLocale}
        </Link>
      </nav>
    </header>
  )
}
