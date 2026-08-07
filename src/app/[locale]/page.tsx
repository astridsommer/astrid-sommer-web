import { client } from '@/sanity/lib/client'
import { urlForImage } from '@/sanity/lib/image'
import { site, type Locale } from '@/i18n/dictionary'
import Reveal from '@/components/Reveal'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 60

async function getObrasDestacadas() {
  try {
    return await client.fetch(
      `*[_type == "obra"] | order(_createdAt desc)[0...6]{ _id, titulo, "slug": slug.current, anio, tecnica, "img": imagenes[0] }`,
    )
  } catch {
    return []
  }
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale }
  const obras = await getObrasDestacadas()

  return (
    <div>
      <section className="min-h-[90vh] flex flex-col justify-center px-6 md:px-12 pt-24">
        <Reveal>
          <p className="text-[13px] tracking-[0.2em] uppercase text-accent mb-6">
            {locale === 'es' ? 'Pintura · Fotografía · Escultura · Obra sobre papel' : 'Painting · Photography · Sculpture · Works on paper'}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-serif italic text-5xl md:text-8xl leading-[1.05] max-w-4xl">
            {site[locale].heroTitle}
          </h1>
        </Reveal>
        <Reveal delay={0.25}>
          <p className="mt-8 text-lg text-muted max-w-md leading-relaxed">
            {site[locale].heroSubtitle}
          </p>
        </Reveal>
        <Reveal delay={0.35}>
          <Link
            href={`/${locale}/contacto`}
            className="inline-block mt-10 text-[13px] tracking-[0.1em] uppercase border-b border-accent text-accent pb-1 hover:opacity-70 transition-opacity w-fit"
          >
            {site[locale].cta} →
          </Link>
        </Reveal>
      </section>

      <section className="px-6 md:px-12 py-10">
        {obras.length === 0 ? (
          <Reveal>
            <div className="border border-line rounded-sm py-24 text-center text-muted text-sm tracking-widest uppercase bg-surface">
              {locale === 'es' ? 'Obra cargándose desde el panel de administración' : 'Work loading from the admin panel'}
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-16">
            {obras.map((obra: any, i: number) => {
              const img = obra.img ? urlForImage(obra.img) : undefined
              return (
                <Reveal key={obra._id} delay={(i % 3) * 0.08}>
                  <Link href={`/${locale}/portafolio/${obra.slug ?? ''}`} className="group block">
                    <div className="relative aspect-[4/5] overflow-hidden bg-surface">
                      {img && (
                        <Image
                          src={img.width(1000).url()}
                          alt={obra.titulo}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        />
                      )}
                    </div>
                    <div className="mt-4 flex items-baseline justify-between">
                      <p className="font-serif italic text-lg">{obra.titulo}</p>
                      <p className="text-xs tracking-widest uppercase text-muted">{obra.anio}</p>
                    </div>
                    {obra.tecnica && <p className="text-xs text-muted mt-1">{obra.tecnica}</p>}
                  </Link>
                </Reveal>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
