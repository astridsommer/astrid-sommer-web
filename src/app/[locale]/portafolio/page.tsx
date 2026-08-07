import { client } from '@/sanity/lib/client'
import { urlForImage } from '@/sanity/lib/image'
import type { Locale } from '@/i18n/dictionary'
import Reveal from '@/components/Reveal'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 60

const CATEGORIAS = ['Pintura', 'Fotografía', 'Escultura', 'Grabado / Monotipia / Acuarela']

async function getObras() {
  try {
    return await client.fetch(`*[_type == "obra"] | order(anio desc){ _id, titulo, "slug": slug.current, anio, tecnica, "img": imagenes[0] }`)
  } catch {
    return []
  }
}

export default async function Portafolio({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale }
  const obras = await getObras()

  return (
    <div className="pt-32 pb-24 px-6 md:px-10">
      <Reveal>
        <h1 className="text-4xl md:text-6xl italic font-light mb-16">
          {locale === 'es' ? 'Portafolio' : 'Portfolio'}
        </h1>
      </Reveal>

      {obras.length === 0 ? (
        <p className="text-muted text-sm tracking-widest uppercase py-24 text-center">
          {locale === 'es' ? 'Obra en proceso de carga' : 'Work being uploaded'}
        </p>
      ) : (
        CATEGORIAS.map((cat) => {
          const items = obras.filter((o: any) => o.tecnica === cat)
          if (items.length === 0) return null
          return (
            <section key={cat} className="mb-20">
              <h2 className="text-sm tracking-widest uppercase text-muted mb-6">{cat}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                {items.map((obra: any) => {
                  const img = obra.img ? urlForImage(obra.img) : undefined
                  return (
                    <Link key={obra._id} href={`/${locale}/portafolio/${obra.slug}`} className="relative aspect-square bg-surface overflow-hidden group">
                      {img && <Image src={img.width(800).url()} alt={obra.titulo} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />}
                    </Link>
                  )
                })}
              </div>
            </section>
          )
        })
      )}
    </div>
  )
}
