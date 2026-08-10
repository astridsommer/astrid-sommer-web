import { client } from '@/sanity/lib/client'
import type { Locale } from '@/i18n/dictionary'
import Reveal from '@/components/Reveal'
import { PAGE_TITLE, PAGE_TITLE_WRAP } from '@/lib/homeStyles'

export const revalidate = 60

async function getTexto() {
  try {
    return await client.fetch(`*[_type == "siteSettings"][0]{ derechosImagenTexto }`)
  } catch {
    return null
  }
}

const PLACEHOLDER: Record<Locale, string> = {
  es: 'Todas las imágenes de obra publicadas en este sitio son propiedad de Astrid Sommer. El uso, reproducción o distribución de estas imágenes sin autorización previa está prohibido. Para solicitar permiso de reproducción, contáctanos a través de la página de Contacto.',
  en: 'All artwork images published on this site are the property of Astrid Sommer. Use, reproduction or distribution of these images without prior authorization is prohibited. To request reproduction permission, please contact us through the Contact page.',
}

export default async function DerechosImagen({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale }
  const data = await getTexto()

  return (
    <div className="pt-32 pb-24 px-6 md:px-10 max-w-2xl">
      <Reveal>
        <h1 className={`${PAGE_TITLE} ${PAGE_TITLE_WRAP}`}>{locale === 'es' ? 'Derechos de imagen y reproducción' : 'Image rights & reproduction'}</h1>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="text-[15px] leading-relaxed text-foreground/70 whitespace-pre-line">
          {data?.derechosImagenTexto || PLACEHOLDER[locale]}
        </p>
      </Reveal>
    </div>
  )
}
