import type { Locale } from '@/i18n/dictionary'
import { nav } from '@/i18n/dictionary'
import Link from 'next/link'

export default function Footer({ locale }: { locale: Locale }) {
  const links: [string, string][] = [
    ['portafolio', nav[locale].portafolio],
    ['exposiciones', nav[locale].exposiciones],
    ['bio', nav[locale].bio],
    ['cv', nav[locale].cv],
    ['noticias', nav[locale].noticias],
    ['contacto', nav[locale].contacto],
  ]

  return (
    <footer className="px-6 md:px-12 pt-7 pb-8 mt-24 border-t border-line grid md:grid-cols-[auto_1fr_auto] gap-3 md:gap-6 items-center text-[11px] uppercase tracking-wide text-foreground/52">
      <span className="font-bold text-foreground/64">Astrid Sommer</span>
      <span className="text-foreground/44">
        {locale === 'es'
          ? 'Artista visual · Ciudad de México · '
          : 'Visual artist · Mexico City · '}
        &copy; {new Date().getFullYear()}
        {locale === 'es' ? ' · Todos los derechos reservados' : ' · All rights reserved'}
      </span>
      <span className="flex flex-wrap items-center gap-x-2 gap-y-1 md:justify-self-end">
        {links.map(([href, label]) => (
          <span key={href} className="flex items-center gap-2">
            <Link href={`/${locale}/${href}`} className="hover:text-accent transition-colors">
              {label}
            </Link>
            <span className="text-foreground/30">·</span>
          </span>
        ))}
        <a href="/studio" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
          Login
        </a>
      </span>
    </footer>
  )
}
