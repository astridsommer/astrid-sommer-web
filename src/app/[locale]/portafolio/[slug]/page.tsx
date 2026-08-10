import { client } from '@/sanity/lib/client'
import { urlForImage } from '@/sanity/lib/image'
import type { Locale } from '@/i18n/dictionary'
import { site } from '@/i18n/dictionary'
import Reveal from '@/components/Reveal'
import { PAGE_TITLE, PAGE_TITLE_WRAP } from '@/lib/homeStyles'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export const revalidate = 60

const DISPONIBILIDAD_LABEL: Record<string, Record<Locale, string>> = {
  Disponible: { es: 'Disponible', en: 'Available' },
  Consultar: { es: 'Consultar', en: 'Inquire' },
  Vendida: { es: 'Vendida', en: 'Sold' },
}

async function getObra(slug: string) {
  try {
    return await client.fetch(
      `*[_type == "obra" && slug.current == $slug][0]{
        _id, titulo, anio, tecnica, medidas, imagenes, disponibilidad,
        "exposiciones": exposiciones[]->{ titulo, "slug": slug.current }
      }`,
      { slug },
    )
  } catch {
    return null
  }
}

export default async function ObraDetalle({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params as { locale: Locale; slug: string }
  const obra = await getObra(slug)
  if (!obra) notFound()

  const img = obra.imagenes?.[0] ? urlForImage(obra.imagenes[0])?.width(1800).url() : undefined
  const disponibilidadLabel = obra.disponibilidad
    ? DISPONIBILIDAD_LABEL[obra.disponibilidad]?.[locale] ?? obra.disponibilidad
    : undefined

  const datos: { label: string; value: string }[] = []
  if (obra.anio) datos.push({ label: locale === 'es' ? 'Año' : 'Year', value: String(obra.anio) })
  if (obra.tecnica) datos.push({ label: locale === 'es' ? 'Técnica' : 'Medium', value: obra.tecnica })
  if (obra.medidas) datos.push({ label: locale === 'es' ? 'Medidas' : 'Dimensions', value: obra.medidas })
  if (disponibilidadLabel) datos.push({ label: locale === 'es' ? 'Disponibilidad' : 'Availability', value: disponibilidadLabel })
  if (obra.exposiciones?.length) {
    datos.push({
      label: locale === 'es' ? 'Exposición' : 'Exhibition',
      value: obra.exposiciones.map((e: any) => e.titulo).filter(Boolean).join(', '),
    })
  }

  return (
    <div className="pt-32 pb-24 px-6 md:px-10">
      <Reveal>
        <Link href={`/${locale}/portafolio`} className="text-[12px] uppercase tracking-wide text-muted hover:text-accent transition-colors">
          ← {locale === 'es' ? 'Obra' : 'Work'}
        </Link>
      </Reveal>

      <div className={`grid md:grid-cols-[1.3fr_1fr] gap-10 md:gap-16 mt-8`}>
        <Reveal delay={0.05}>
          <div className="relative w-full bg-surface overflow-hidden aspect-[4/5]">
            {img ? (
              <Image src={img} alt={obra.titulo ?? ''} fill className="object-contain" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[11px] uppercase tracking-widest text-muted">
                {locale === 'es' ? 'Imagen no disponible' : 'Image not available'}
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 className={`${PAGE_TITLE} ${PAGE_TITLE_WRAP}`}>{obra.titulo ?? (locale === 'es' ? 'Sin título' : 'Untitled')}</h1>

          {datos.length > 0 && (
            <dl className="space-y-3 mb-10">
              {datos.map((d) => (
                <div key={d.label} className="flex gap-4 text-[14px] border-b border-line pb-3">
                  <dt className="w-32 shrink-0 text-muted uppercase tracking-wide text-[11px] pt-0.5">{d.label}</dt>
                  <dd className="text-foreground/80">{d.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <Link
            href={`/${locale}/contacto`}
            className="inline-block text-[12px] uppercase tracking-wide border-b border-accent/60 pb-1 text-foreground/80 hover:text-accent hover:border-accent transition-colors"
          >
            {site[locale].cta}
          </Link>
        </Reveal>
      </div>
    </div>
  )
}
