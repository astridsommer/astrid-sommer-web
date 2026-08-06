import type { Locale } from '@/i18n/dictionary'
import { nav } from '@/i18n/dictionary'
import Link from 'next/link'

export default function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="border-t border-line px-6 md:px-12 py-14 mt-32">
      <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-4">
        <div>
          <p className="font-serif text-xl mb-1">Astrid Sommer</p>
          <p className="text-sm text-muted">
            {locale === 'es' ? 'Artista visual — Ciudad de México' : 'Visual artist — Mexico City'}
          </p>
        </div>
        <div className="flex gap-10 text-[13px] tracking-[0.08em] uppercase text-foreground/70">
          <Link href={`/${locale}/contacto`} className="hover:text-accent transition-colors">
            {nav[locale].contacto}
          </Link>
          <a href="https://www.instagram.com/mtallermx" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
            Instagram
          </a>
          <a href="http://www.facebook.com/astrid.sommer.568" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
            Facebook
          </a>
        </div>
      </div>
      <p className="text-xs text-muted mt-12">&copy; {new Date().getFullYear()} Astrid Sommer</p>
    </footer>
  )
}
