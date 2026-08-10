import { client } from '@/sanity/lib/client'
import { urlForImage } from '@/sanity/lib/image'
import type { Locale } from '@/i18n/dictionary'
import Reveal from '@/components/Reveal'
import Image from 'next/image'
import { PAGE_TITLE, PAGE_TITLE_WRAP } from '@/lib/homeStyles'

export const revalidate = 60

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
  const foto = bio?.foto ? urlForImage(bio.foto)?.width(900).url() : undefined

  return (
    <div className="pt-32 pb-24 px-6 md:px-10 max-w-4xl mx-auto">
      <Reveal>
        <h1 className={`${PAGE_TITLE} ${PAGE_TITLE_WRAP}`}>
          {locale === 'es' ? 'Biografía' : 'Biography'}
        </h1>
      </Reveal>

      <div className={foto ? 'grid md:grid-cols-[.85fr_1.15fr] gap-10 md:gap-16 items-start' : ''}>
        {foto && (
          <Reveal delay={0.05}>
            <div className="relative aspect-[4/5] bg-surface overflow-hidden">
              <Image src={foto} alt={locale === 'es' ? 'Astrid Sommer' : 'Astrid Sommer'} fill className="object-cover" />
            </div>
          </Reveal>
        )}

        <div>
          <Reveal delay={0.1}>
            <p className="whitespace-pre-line text-foreground/90 leading-relaxed">
              {bio?.texto?.[locale] ?? (locale === 'es'
                ? 'Contenido en preparación — se está migrando la biografía completa desde el sitio anterior.'
                : 'Content in progress — the full biography is being migrated from the previous site.')}
            </p>
          </Reveal>

          {bio?.statement?.[locale] && (
            <Reveal delay={0.15}>
              <h2 className="mt-12 text-sm tracking-widest uppercase text-muted">
                {locale === 'es' ? 'Statement' : 'Artist statement'}
              </h2>
              <p className="mt-4 whitespace-pre-line italic text-foreground/75 leading-relaxed">
                {bio.statement[locale]}
              </p>
            </Reveal>
          )}
        </div>
      </div>

      {bio?.estudios?.length > 0 && (
        <Reveal delay={0.2}>
          <h2 className="mt-12 text-sm tracking-widest uppercase text-muted">
            {locale === 'es' ? 'Estudios' : 'Studies'}
          </h2>
          <ul className="mt-4 space-y-1 text-foreground/80">
            {bio.estudios.map((e: string) => <li key={e}>{e}</li>)}
          </ul>
        </Reveal>
      )}
      {bio?.premios?.length > 0 && (
        <Reveal delay={0.3}>
          <h2 className="mt-12 text-sm tracking-widest uppercase text-muted">
            {locale === 'es' ? 'Premios y bienales' : 'Awards & biennials'}
          </h2>
          <ul className="mt-4 space-y-1 text-foreground/80">
            {bio.premios.map((e: string) => <li key={e}>{e}</li>)}
          </ul>
        </Reveal>
      )}
    </div>
  )
}
