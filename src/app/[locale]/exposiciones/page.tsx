import { client } from '@/sanity/lib/client'
import type { Locale } from '@/i18n/dictionary'
import Reveal from '@/components/Reveal'

async function getExposiciones() {
  try {
    return await client.fetch(`*[_type == "exposicion"] | order(fechaInicio desc)`)
  } catch {
    return []
  }
}

export default async function Exposiciones({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale }
  const exposiciones = await getExposiciones()

  return (
    <div className="pt-32 pb-24 px-6 md:px-10 max-w-3xl mx-auto">
      <Reveal>
        <h1 className="text-4xl md:text-6xl italic font-light mb-16">
          {locale === 'es' ? 'Exposiciones' : 'Exhibitions'}
        </h1>
      </Reveal>
      {exposiciones.length === 0 ? (
        <p className="text-muted text-sm tracking-widest uppercase py-12 text-center">
          {locale === 'es' ? 'Contenido en migración' : 'Content being migrated'}
        </p>
      ) : (
        <ul className="space-y-8">
          {exposiciones.map((exp: any) => (
            <Reveal key={exp._id}>
              <li className="border-b border-line pb-6">
                <p className="text-xs tracking-widest uppercase text-muted">{exp.fechaInicio?.slice(0, 4)} · {exp.tipo}</p>
                <p className="text-lg mt-1">{exp.titulo}</p>
                <p className="text-muted text-sm mt-1">{exp.lugar}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      )}
    </div>
  )
}
