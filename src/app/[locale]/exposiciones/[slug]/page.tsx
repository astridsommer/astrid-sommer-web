import { client } from '@/sanity/lib/client'
import { urlForImage } from '@/sanity/lib/image'
import type { Locale } from '@/i18n/dictionary'
import Reveal from '@/components/Reveal'
import { PAGE_TITLE, PAGE_TITLE_WRAP } from '@/lib/homeStyles'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export const revalidate = 60

async function getExposicion(slug: string) {
  try {
    return await client.fetch(
      `*[_type == "exposicion" && slug.current == $slug][0]{
        _id, titulo, tipo, fechaInicio, fechaFin, lugar, ciudad, pais, portada, textoCorto, textoCuratorial, fotosMontaje
      }`,
      { slug },
    )
  } catch {
    return null
  }
}

async function getObrasDeExposicion(id: string) {
  try {
    return await client.fetch(
      `*[_type == "obra" && references($id)] | order(orden asc){ _id, titulo, "slug": slug.current, anio, "img": imagenes[0] }`,
      { id },
    )
  } catch {
    return []
  }
}

export default async function ExposicionDetalle({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params as { locale: Locale; slug: string }
  const expo = await getExposicion(slug)
  if (!expo) notFound()

  const obras = await getObrasDeExposicion(expo._id)
  const portada = expo.portada ? urlForImage(expo.portada)?.width(1600).url() : undefined
  const anio = expo.fechaInicio ? new Date(expo.fechaInicio).getFullYear() : ''
  const lugarCompleto = [expo.lugar, expo.ciudad, expo.pais].filter(Boolean).join(', ')

  return (
    <div className="pt-32 pb-24 px-6 md:px-10">
      <Reveal>
        <Link href={`/${locale}/exposiciones`} className="text-[12px] uppercase tracking-wide text-muted hover:text-accent transition-colors">
          ← {locale === 'es' ? 'Exposiciones' : 'Exhibitions'}
        </Link>
      </Reveal>

      <Reveal delay={0.05}>
        <p className="text-[12px] font-semibold uppercase tracking-wide text-muted mt-6 mb-2">
          {[anio, expo.lugar].filter(Boolean).join(' · ')}
        </p>
        <h1 className={PAGE_TITLE}>{expo.titulo}</h1>
        {lugarCompleto && <p className="text-[14px] text-foreground/60 mt-3">{lugarCompleto}</p>}
        <div className={PAGE_TITLE_WRAP} />
      </Reveal>

      {portada && (
        <Reveal delay={0.1}>
          <div className="relative aspect-[16/9] bg-surface overflow-hidden mb-12">
            <Image src={portada} alt={expo.titulo} fill className="object-cover" />
          </div>
        </Reveal>
      )}

      {(expo.textoCuratorial?.[locale] || expo.textoCorto) && (
        <Reveal delay={0.15}>
          <p className="max-w-2xl text-[16px] leading-relaxed text-foreground/75 mb-16 whitespace-pre-line">
            {expo.textoCuratorial?.[locale] || expo.textoCorto}
          </p>
        </Reveal>
      )}

      {Array.isArray(expo.fotosMontaje) && expo.fotosMontaje.length > 0 && (
        <section className="mb-16">
          <h2 className="text-[12px] uppercase tracking-wide text-muted mb-6">
            {locale === 'es' ? 'Montaje' : 'Installation'}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {expo.fotosMontaje.map((img: any, i: number) => {
              const url = urlForImage(img)?.width(900).url()
              return (
                <div key={i} className="relative aspect-[4/5] bg-surface overflow-hidden">
                  {url && <Image src={url} alt="" fill className="object-cover" />}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {obras.length > 0 && (
        <section>
          <h2 className="text-[12px] uppercase tracking-wide text-muted mb-6">
            {locale === 'es' ? 'Obras de esta exposición' : 'Works in this exhibition'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
            {obras.map((obra: any) => {
              const img = obra.img ? urlForImage(obra.img)?.width(800).url() : undefined
              return (
                <Link key={obra._id} href={`/${locale}/portafolio/${obra.slug}`} className="relative aspect-square bg-surface overflow-hidden group">
                  {img && <Image src={img} alt={obra.titulo} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />}
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
