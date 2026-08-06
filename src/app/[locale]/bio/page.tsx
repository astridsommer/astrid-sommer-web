import { client } from '@/sanity/lib/client'
import type { Locale } from '@/i18n/dictionary'
import Reveal from '@/components/Reveal'

async function getBio() {
  try {
    return await client.fetch(`*[_type == "bio"][0]`)
  } catch {
    return null
  }
}

export default async function BioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale }
  const bio = await getBio()

  return (
    <div className="pt-32 pb-24 px-6 md:px-10 max-w-3xl mx-auto">
      <Reveal>
        <h1 className="text-3xl md:text-5xl font-light mb-10">
          {locale === 'es' ? 'Biografía' : 'Biography'}
        </h1>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="whitespace-pre-line text-black/80 leading-relaxed">
          {bio?.texto?.[locale] ?? (locale === 'es'
            ? 'Contenido en preparación — se está migrando la biografía completa desde el sitio anterior.'
            : 'Content in progress — the full biography is being migrated from the previous site.')}
        </p>
      </Reveal>
      {bio?.estudios?.length > 0 && (
        <Reveal delay={0.2}>
          <h2 className="mt-12 text-sm tracking-widest uppercase text-black/50">
            {locale === 'es' ? 'Estudios' : 'Studies'}
          </h2>
          <ul className="mt-4 space-y-1 text-black/70">
            {bio.estudios.map((e: string) => <li key={e}>{e}</li>)}
          </ul>
        </Reveal>
      )}
      {bio?.premios?.length > 0 && (
        <Reveal delay={0.3}>
          <h2 className="mt-12 text-sm tracking-widest uppercase text-black/50">
            {locale === 'es' ? 'Premios y bienales' : 'Awards & biennials'}
          </h2>
          <ul className="mt-4 space-y-1 text-black/70">
            {bio.premios.map((e: string) => <li key={e}>{e}</li>)}
          </ul>
        </Reveal>
      )}
    </div>
  )
}
