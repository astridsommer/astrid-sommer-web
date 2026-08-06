import { client } from '@/sanity/lib/client'
import { urlForImage } from '@/sanity/lib/image'
import { site, type Locale } from '@/i18n/dictionary'
import Reveal from '@/components/Reveal'
import Link from 'next/link'
import Image from 'next/image'

async function getObrasDestacadas() {
  try {
    return await client.fetch(
      `*[_type == "obra"] | order(_createdAt desc)[0...6]{ _id, titulo, "slug": slug.current, anio, "img": imagenes[0] }`,
    )
  } catch {
    return []
  }
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale }
  const obras = await getObrasDestacadas()

  return (
    <div className="pt-32 pb-16">
      <section className="px-6 md:px-10">
        <Reveal>
          <h1 className="text-4xl md:text-7xl font-light tracking-tight max-w-4xl">
            {site[locale].heroTitle}
          </h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-6 text-base md:text-lg text-black/60 max-w-xl">
            {site[locale].heroSubtitle}
          </p>
        </Reveal>
      </section>

      <section className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-1 px-1">
        {obras.length === 0 && (
          <div className="col-span-2 px-6 md:px-10 py-24 text-center text-black/40 text-sm tracking-widest uppercase">
            Próximamente — obra cargándose desde el panel de administración
          </div>
        )}
        {obras.map((obra: any, i: number) => {
          const img = obra.img ? urlForImage(obra.img) : undefined
          return (
            <Reveal key={obra._id} delay={(i % 2) * 0.1}>
              <Link href={`/${locale}/portafolio/${obra.slug ?? ''}`} className="group block relative aspect-[4/5] overflow-hidden bg-black/5">
                {img && (
                  <Image
                    src={img.width(1200).url()}
                    alt={obra.titulo}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-sm">{obra.titulo} {obra.anio ? `· ${obra.anio}` : ''}</p>
                </div>
              </Link>
            </Reveal>
          )
        })}
      </section>
    </div>
  )
}
