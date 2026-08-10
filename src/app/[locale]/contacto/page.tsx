import { client } from '@/sanity/lib/client'
import type { Locale } from '@/i18n/dictionary'
import { site } from '@/i18n/dictionary'
import Reveal from '@/components/Reveal'
import ContactRow from '@/components/ContactRow'
import { PAGE_TITLE } from '@/lib/homeStyles'
import Link from 'next/link'

export const revalidate = 60

async function getSettings() {
  try {
    return await client.fetch(
      `*[_type == "siteSettings"][0]{ correo, whatsapp, instagram, catalogoActivo, "catalogoUrl": catalogoArchivo.asset->url }`,
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
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-foreground/65">{site[locale].contactIntro}</p>
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
              <ContactRow href={settings.catalogoUrl} label={locale === 'es' ? 'Catálogo' : 'Catalogue'} icon="catalogo" external />
            )}
            {settings?.instagram && (
              <ContactRow
                href={settings.instagram.startsWith('http') ? settings.instagram : `https://instagram.com/${settings.instagram.replace('@', '')}`}
                label="Instagram"
                icon="instagram"
                external
              />
            )}
            <div className="border-t border-line/70 h-px" />
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.15}>
        <div className="border-t border-line pt-7 flex flex-wrap gap-x-8 gap-y-2 text-[11px] uppercase tracking-wide text-foreground/45">
          <Link href={`/${locale}/aviso-privacidad`} className="hover:text-accent transition-colors">
            {locale === 'es' ? 'Aviso de privacidad' : 'Privacy notice'}
          </Link>
          <Link href={`/${locale}/derechos-imagen`} className="hover:text-accent transition-colors">
            {locale === 'es' ? 'Derechos de imagen y reproducción' : 'Image rights & reproduction'}
          </Link>
          <a href="/studio" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
            Login
          </a>
        </div>
      </Reveal>
    </div>
  )
}
