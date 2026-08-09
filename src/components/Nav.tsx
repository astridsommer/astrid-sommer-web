'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { nav, type Locale } from '@/i18n/dictionary'

type DropdownExpo = { _id: string; titulo: string; slug: string }

export default function Nav({ locale, dropdownExposiciones = [] }: { locale: Locale; dropdownExposiciones?: DropdownExpo[] }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const items: [string, string][] = [
    ['', nav[locale].home],
    ['portafolio', nav[locale].portafolio],
    ['exposiciones', nav[locale].exposiciones],
    ['bio', nav[locale].bio],
    ['cv', nav[locale].cv],
    ['noticias', nav[locale].noticias],
    ['resenas', nav[locale].resenas],
    ['contacto', nav[locale].contacto],
  ]
  const otherLocale = locale === 'es' ? 'en' : 'es'
  const restOfPath = pathname.split('/').slice(2).join('/')

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        scrolled || open ? 'bg-background/95 backdrop-blur-sm border-b border-line' : 'bg-transparent'
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
            const isExpo = href === 'exposiciones'
            return (
              <li key={href} className={isExpo ? 'relative group' : ''}>
                <Link href={url} className={`transition-colors hover:text-accent ${active ? 'text-accent' : ''}`}>
                  {label}
                </Link>
                {isExpo && dropdownExposiciones.length > 0 && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 pointer-events-none translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:pointer-events-auto">
                    <div className="min-w-[220px] bg-background/95 backdrop-blur-sm border border-line shadow-lg p-4 grid gap-3">
                      {dropdownExposiciones.map((expo) => (
                        <Link
                          key={expo._id}
                          href={`/${locale}/exposiciones`}
                          className="text-[11px] normal-case text-foreground/65 hover:text-accent transition-colors leading-snug"
                        >
                          {expo.titulo}
                        </Link>
                      ))}
                      <Link href={`/${locale}/exposiciones`} className="text-[11px] text-foreground/45 hover:text-accent transition-colors">
                        {locale === 'es' ? 'Ver todas' : 'View all'}
                      </Link>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
        <div className="hidden md:block">
          <Link
            href={`/${otherLocale}/${restOfPath}`}
            className="text-[13px] tracking-[0.08em] uppercase text-foreground/50 hover:text-accent transition-colors"
          >
            {otherLocale}
          </Link>
        </div>
        <button
          type="button"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden flex flex-col gap-[5px] w-7 h-7 items-center justify-center"
        >
          <span className={`block h-px w-5 bg-foreground transition-transform ${open ? 'translate-y-[3px] rotate-45' : ''}`} />
          <span className={`block h-px w-5 bg-foreground transition-transform ${open ? '-translate-y-[3px] -rotate-45' : ''}`} />
        </button>
      </nav>

      {open && (
        <div className="md:hidden px-6 pb-8 pt-2">
          <ul className="flex flex-col gap-1 text-[15px] tracking-[0.04em] uppercase text-foreground/80">
            {items.map(([href, label]) => {
              const url = `/${locale}/${href}`.replace(/\/$/, '') || `/${locale}`
              const active = pathname === url
              return (
                <li key={href} className="border-b border-line">
                  <Link href={url} onClick={() => setOpen(false)} className={`block py-3 transition-colors ${active ? 'text-accent' : ''}`}>
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
          <Link href={`/${otherLocale}/${restOfPath}`} onClick={() => setOpen(false)} className="inline-block mt-5 text-[13px] tracking-[0.08em] uppercase text-foreground/50">
            {locale === 'es' ? 'Ver en inglés' : 'Ver en español'} ({otherLocale.toUpperCase()})
          </Link>
        </div>
      )}
    </header>
  )
}
