import { client } from '@/sanity/lib/client'
import { urlForImage } from '@/sanity/lib/image'
import type { Locale } from '@/i18n/dictionary'
import Reveal from '@/components/Reveal'
import { PAGE_TITLE, PAGE_TITLE_WRAP } from '@/lib/homeStyles'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 60

async function getExposiciones() {
  try {
    return await client.fetch(
      `*[_type == "exposicion"] | order(fechaInicio desc){ _id, titulo, "slug": slug.current, tipo, fechaInicio, lugar, ciudad, pais, portada }`,
    )
  } catch {
    return []
  }
}

export default async function Exposiciones({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale }
  const exposiciones = await getExposiciones()

  return (
    <div className="pt-32 pb-24 px-6 md:px-10">
      <Reveal>
        <h1 className={`${PAGE_TITLE} ${PAGE_TITLE_WRAP}`}>{locale === 'es' ? 'Exposiciones' : 'Exhibitions'}</h1>
      </Reveal>
      {exposiciones.length === 0 ? (
        <p className="text-muted text-sm tracking-widest uppercase py-12 text-center">
          {locale === 'es' ? 'Contenido en migración' : 'Content being migrated'}
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14 max-w-6xl">
          {exposiciones.map((exp: any) => {
            const img = exp.portada ? urlForImage(exp.portada)?.width(900).url() : undefined
            const anio = exp.fechaInicio ? new Date(exp.fechaInicio).getFullYear() : ''
            const lugarCorto = [exp.lugar, exp.ciudad].filter(Boolean).join(' · ')
            return (
              <Reveal key={exp._id}>
                <Link href={exp.slug ? `/${locale}/exposiciones/${exp.slug}` : `/${locale}/exposiciones`} className="group block">
                  <div className="relative aspect-[4/5] bg-surface overflow-hidden">
                    {img && <Image src={img} alt={exp.titulo} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-700" />}
                  </div>
                  <div className="flex justify-between text-[12px] font-semibold uppercase tracking-wide text-muted mt-4">
                    <span>Expo</span>
                    <span>{[anio, lugarCorto].filter(Boolean).join(' · ')}</span>
                  </div>
                  <h2 className="font-sans font-normal text-[19px] text-foreground/62 mt-3.5">{exp.titulo}</h2>
                </Link>
              </Reveal>
            )
          })}
        </div>
      )}
    </div>
  )
}
