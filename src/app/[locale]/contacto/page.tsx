import { client } from '@/sanity/lib/client'
import type { Locale } from '@/i18n/dictionary'
import { site } from '@/i18n/dictionary'
import Reveal from '@/components/Reveal'
import ContactRow from '@/components/ContactRow'
import { PAGE_TITLE, PAGE_TITLE_WRAP } from '@/lib/homeStyles'
import Link from 'next/link'

export const revalidate = 60

async function getSettings() {
  try {
    return await client.fetch(
      `*[_type == "siteSettings"][0]{ correo, whatsapp, instagram, instagramTaller, tallerNombre, tallerDireccion, catalogoActivo, "catalogoUrl": catalogoArchivo.asset->url }`,
    )
  } catch {
    return null
  }
}

export default async function Contacto({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale }
  const settings = await getSettings()

  return (
    <div className="pt-32 pb-24 px-6 md:px-10">
      <div className="grid md:grid-cols-[1fr_.55fr] gap-10 md:gap-20 items-start mb-20">
        <Reveal>
          <h1 className={PAGE_TITLE}>{locale === 'es' ? 'Contacto' : 'Contact'}</h1>
          <p className={`${PAGE_TITLE_WRAP} mt-6 max-w-md text-[15px] leading-relaxed text-foreground/65`}>{site[locale].contactIntro}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="w-full md:max-w-[480px] md:justify-self-end grid">
            <ContactRow
              href={settings?.correo ? `mailto:${settings.correo}` : '#'}
              label={site[locale].cta}
              icon="mail"
            />
            {settings?.whatsapp && (
              <ContactRow
                href={settings.whatsapp.startsWith('http') ? settings.whatsapp : `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                label="WhatsApp"
                icon="whatsapp"
                external
              />
            )}
            {settings?.catalogoActivo && settings?.catalogoUrl && (
              <ContactRow href={settings.catalogoUrl} label={locale === 'es' ? 'Catálogos y publicaciones' : 'Catalogues & publications'} icon="catalogo" external />
            )}
            {settings?.tallerNombre && (
              <div className="flex items-center justify-between gap-4 py-[17px] border-t border-line/70">
                <span className="flex items-center gap-3 text-[13px] font-semibold uppercase tracking-wide text-foreground/68">
                  <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] shrink-0 stroke-foreground/40" strokeWidth="1.7" fill="none">
                    <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" />
                    <circle cx="12" cy="9.5" r="2.4" />
                  </svg>
                  {settings.tallerNombre}
                </span>
                {settings?.tallerDireccion && (
                  <span className="text-[12px] text-foreground/55 text-right max-w-[220px]">{settings.tallerDireccion}</span>
                )}
              </div>
            )}
            {settings?.instagram && (
              <ContactRow
                href={settings.instagram.startsWith('http') ? settings.instagram : `https://instagram.com/${settings.instagram.replace('@', '')}`}
                label={locale === 'es' ? 'Instagram · Astrid Sommer' : 'Instagram · Astrid Sommer'}
                icon="instagram"
                external
              />
            )}
            {settings?.instagramTaller && (
              <ContactRow
                href={settings.instagramTaller.startsWith('http') ? settings.instagramTaller : `https://instagram.com/${settings.instagramTaller.replace('@', '')}`}
                label="Instagram · M Taller"
                icon="instagram"
                external
              />
            )}
            <div className="border-t border-line/70 h-px" />
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.15}>
        <div className="mt-20 pt-10 border-t border-line max-w-md">
          <h2 className="text-[11px] tracking-widest uppercase text-muted mb-1">Legal</h2>
          <div className="grid">
            <Link
              href={`/${locale}/aviso-privacidad`}
              className="flex items-center justify-between py-3 border-t border-line/70 text-[12px] uppercase tracking-wide text-foreground/55 hover:text-accent transition-colors"
            >
              {locale === 'es' ? 'Aviso de privacidad' : 'Privacy notice'}
              <span>›</span>
            </Link>
            <Link
              href={`/${locale}/derechos-imagen`}
              className="flex items-center justify-between py-3 border-t border-line/70 text-[12px] uppercase tracking-wide text-foreground/55 hover:text-accent transition-colors"
            >
              {locale === 'es' ? 'Derechos de imagen y reproducción' : 'Image rights & reproduction'}
              <span>›</span>
            </Link>
            <a
              href="/studio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between py-3 border-t border-b border-line/70 text-[12px] uppercase tracking-wide text-foreground/55 hover:text-accent transition-colors"
            >
              Login
              <span>›</span>
            </a>
          </div>
        </div>
      </Reveal>
    </div>
  )
}
