'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { nav, type Locale } from '@/i18n/dictionary'

export default function Nav({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        scrolled ? 'bg-background/90 backdrop-blur-sm border-b border-line' : 'bg-transparent'
      }`}
    >
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 md:py-6">
        <Link href={`/${locale}`} className="font-serif text-lg tracking-wide">
          Astrid Sommer
        </Link>
        <ul className="hidden md:flex gap-9 text-[13px] tracking-[0.08em] uppercase text-foreground/70">
          {items.map(([href, label]) => {
            const url = `/${locale}/${href}`.replace(/\/$/, '') || `/${locale}`
            const active = pathname === url
            return (
              <li key={href}>
                <Link href={url} className={`transition-colors hover:text-accent ${active ? 'text-accent' : ''}`}>
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
        <Link
          href={`/${otherLocale}/${restOfPath}`}
          className="text-[13px] tracking-[0.08em] uppercase text-foreground/50 hover:text-accent transition-colors"
        >
          {otherLocale}
        </Link>
      </nav>
    </header>
  )
}
