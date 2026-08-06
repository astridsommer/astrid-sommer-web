import type { Locale } from '@/i18n/dictionary'
import { site } from '@/i18n/dictionary'
import Reveal from '@/components/Reveal'
import ContactForm from '@/components/ContactForm'

export default async function Contacto({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale }
  return (
    <div className="pt-32 pb-24 px-6 md:px-10 max-w-3xl mx-auto">
      <Reveal>
        <h1 className="text-4xl md:text-6xl italic font-light mb-6">
          {locale === 'es' ? 'Contacto' : 'Contact'}
        </h1>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="text-muted mb-12 max-w-xl">{site[locale].contactIntro}</p>
      </Reveal>
      <Reveal delay={0.2}>
        <ContactForm locale={locale} />
      </Reveal>
    </div>
  )
}
