import { client } from '@/sanity/lib/client'
import type { Locale } from '@/i18n/dictionary'
import Reveal from '@/components/Reveal'
import { PAGE_TITLE } from '@/lib/homeStyles'

export const revalidate = 60

async function getTexto() {
  try {
    return await client.fetch(`*[_type == "siteSettings"][0]{ avisoPrivacidadTexto }`)
  } catch {
    return null
  }
}

const PLACEHOLDER: Record<Locale, string> = {
  es: 'Este aviso de privacidad está en preparación. Para cualquier consulta sobre el tratamiento de tus datos personales, escríbenos directamente a través de la página de Contacto.',
  en: 'This privacy notice is being prepared. For any questions about how your personal data is handled, please reach out directly through the Contact page.',
}

export default async function AvisoPrivacidad({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale }
  const data = await getTexto()

  return (
    <div className="pt-32 pb-24 px-6 md:px-10 max-w-2xl">
      <Reveal>
        <h1 className={`${PAGE_TITLE} mb-10`}>{locale === 'es' ? 'Aviso de privacidad' : 'Privacy notice'}</h1>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="text-[15px] leading-relaxed text-foreground/70 whitespace-pre-line">
          {data?.avisoPrivacidadTexto || PLACEHOLDER[locale]}
        </p>
      </Reveal>
    </div>
  )
}
