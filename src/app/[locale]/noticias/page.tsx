import { client } from '@/sanity/lib/client'
import { urlForImage } from '@/sanity/lib/image'
import type { Locale } from '@/i18n/dictionary'
import Reveal from '@/components/Reveal'
import Image from 'next/image'
import { PAGE_TITLE, PAGE_TITLE_WRAP } from '@/lib/homeStyles'

export const revalidate = 60

async function getNoticias() {
  try {
    return await client.fetch(
      `*[_type == "noticia" && estado == "publicado"] | order(fecha desc){ _id, titulo, fecha, cuerpo, imagenDestacada }`,
    )
  } catch {
    return []
  }
}

export default async function Noticias({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale }
  const noticias = await getNoticias()

  return (
    <div className="pt-32 pb-24 px-6 md:px-10 max-w-3xl mx-auto">
      <Reveal>
        <h1 className={`${PAGE_TITLE} ${PAGE_TITLE_WRAP}`}>
          {locale === 'es' ? 'Noticias' : 'News'}
        </h1>
      </Reveal>
      {noticias.length === 0 ? (
        <p className="text-muted text-sm tracking-widest uppercase py-12 text-center">
          {locale === 'es' ? 'Aún no hay noticias publicadas' : 'No news published yet'}
        </p>
      ) : (
        <ul className="space-y-16">
          {noticias.map((n: any) => {
            const img = n.imagenDestacada ? urlForImage(n.imagenDestacada) : undefined
            return (
              <Reveal key={n._id}>
                <li>
                  <p className="text-xs tracking-widest uppercase text-muted">
                    {new Date(n.fecha).toLocaleDateString(locale === 'es' ? 'es-MX' : 'en-US', { year: 'numeric', month: 'long' })}
                  </p>
                  <h2 className="text-2xl mt-2">{n.titulo?.[locale]}</h2>
                  {img && (
                    <div className="relative w-full aspect-video mt-4 bg-surface">
                      <Image src={img.width(1200).url()} alt={n.titulo?.[locale] ?? ''} fill className="object-cover" />
                    </div>
                  )}
                  <p className="mt-4 text-foreground/80 leading-relaxed whitespace-pre-line">{n.cuerpo?.[locale]}</p>
                </li>
              </Reveal>
            )
          })}
        </ul>
      )}
    </div>
  )
}
