import { client } from '@/sanity/lib/client'
import type { Locale } from '@/i18n/dictionary'
import Reveal from '@/components/Reveal'

async function getResenas() {
  try {
    return await client.fetch(`*[_type == "resena"] | order(fecha desc){ _id, autor, medio, fecha, texto, fuenteUrl, "expoTitulo": exposicion->titulo }`)
  } catch {
    return []
  }
}

export default async function Resenas({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale }
  const resenas = await getResenas()

  return (
    <div className="pt-32 pb-24 px-6 md:px-10 max-w-3xl mx-auto">
      <Reveal>
        <h1 className="text-3xl md:text-5xl font-light mb-16">
          {locale === 'es' ? 'Reseñas' : 'Reviews'}
        </h1>
      </Reveal>
      {resenas.length === 0 ? (
        <p className="text-black/40 text-sm tracking-widest uppercase py-12 text-center">
          {locale === 'es' ? 'Contenido en migración' : 'Content being migrated'}
        </p>
      ) : (
        <ul className="space-y-10">
          {resenas.map((r: any) => (
            <Reveal key={r._id}>
              <li className="border-b border-black/10 pb-8">
                <p className="text-sm text-black/50">{r.autor} · {r.medio}</p>
                <p className="mt-2 text-black/80 leading-relaxed">{r.texto}</p>
                {r.fuenteUrl && <a href={r.fuenteUrl} className="text-xs uppercase tracking-widest mt-3 inline-block underline" target="_blank" rel="noreferrer">{locale === 'es' ? 'Leer más' : 'Read more'}</a>}
              </li>
            </Reveal>
          ))}
        </ul>
      )}
    </div>
  )
}
