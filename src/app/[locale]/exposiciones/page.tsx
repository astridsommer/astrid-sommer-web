import { client } from '@/sanity/lib/client'
import { urlForImage } from '@/sanity/lib/image'
import type { Locale } from '@/i18n/dictionary'
import Reveal from '@/components/Reveal'
import { PAGE_TITLE, PAGE_TITLE_WRAP, PAGE_X } from '@/lib/homeStyles'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 60

async function getExposiciones() {
  try {
    return await client.fetch(
      `*[_type == "exposicion"] | order(fechaInicio desc){ _id, titulo, "slug": slug.current, tipo, fechaInicio, lugar, ciudad, pais, portada, textoCorto }`,
    )
  } catch {
    return []
  }
}

export default async function Exposiciones({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale }
  const exposiciones = await getExposiciones()

  return (
    <div className={`pt-32 pb-24 ${PAGE_X}`}>
      <Reveal>
        <h1 className={`${PAGE_TITLE} ${PAGE_TITLE_WRAP}`}>{locale === 'es' ? 'Exposiciones' : 'Exhibitions'}</h1>
      </Reveal>
      {exposiciones.length === 0 ? (
        <p className="text-muted text-sm tracking-widest uppercase py-12 max-w-3xl">
          {locale === 'es' ? 'Contenido en migración' : 'Content being migrated'}
        </p>
      ) : (
        <div className="max-w-5xl divide-y divide-line/70">
          {exposiciones.map((exp: any) => {
            const img = exp.portada ? urlForImage(exp.portada)?.width(900).url() : undefined
            const anio = exp.fechaInicio ? new Date(exp.fechaInicio).getFullYear() : ''
            const lugarCorto = [exp.lugar, exp.ciudad].filter(Boolean).join(' · ')
            return (
              <Reveal key={exp._id}>
                <Link
                  href={exp.slug ? `/${locale}/exposiciones/${exp.slug}` : `/${locale}/exposiciones`}
                  className="group grid md:grid-cols-[280px_1fr] gap-6 md:gap-14 py-10 md:py-12 items-start"
                >
                  <div className={`relative w-full aspect-[4/5] overflow-hidden ${img ? 'bg-surface' : 'border border-line/70'}`}>
                    {img ? (
                      <Image
                        src={img}
                        alt={exp.titulo}
                        fill
                        className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-700"
                      />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-widest text-muted/70 text-center px-4">
                        {exp.titulo}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold uppercase tracking-wide text-muted mb-3">
                      <span>Expo</span>
                      <span>{[anio, lugarCorto].filter(Boolean).join(' · ')}</span>
                    </div>
                    <h2 className="font-sans font-normal text-[17px] leading-[1.2] text-foreground/62 mb-3">{exp.titulo}</h2>
                    {exp.textoCorto && (
                      <p className="text-[13px] leading-relaxed text-foreground/52 max-w-md mb-4">{exp.textoCorto}</p>
                    )}
                    <span className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-foreground/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-foreground/40" />
                      {locale === 'es' ? 'Ver exposición' : 'View exhibition'}
                    </span>
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>
      )}
    </div>
  )
}
