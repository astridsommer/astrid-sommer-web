import { client } from '@/sanity/lib/client'
import type { Locale } from '@/i18n/dictionary'
import Reveal from '@/components/Reveal'
import { PAGE_TITLE, PAGE_TITLE_WRAP, PAGE_X } from '@/lib/homeStyles'

export const revalidate = 60

const CATEGORIAS = ['Estudio', 'Individual', 'Colectiva', 'Premio / Bienal']

async function getCv() {
  try {
    return await client.fetch(
      `*[_type == "cvEntry" && visible == true] | order(anio desc){ _id, anio, anioFin, titulo, lugar, ciudad, pais, categoria, orden }`,
    )
  } catch {
    return []
  }
}

export default async function Cv({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale }
  const entries = await getCv()

  return (
    <div className={`pt-32 pb-24 ${PAGE_X}`}>
      <Reveal>
        <h1 className={`${PAGE_TITLE} ${PAGE_TITLE_WRAP}`}>CV</h1>
      </Reveal>

      {entries.length === 0 ? (
        <p className="text-muted text-sm tracking-widest uppercase py-24 text-center">
          {locale === 'es' ? 'CV en proceso de carga' : 'CV being uploaded'}
        </p>
      ) : (
        CATEGORIAS.map((cat) => {
          const items = entries.filter((e: any) => e.categoria === cat)
          if (items.length === 0) return null
          return (
            <section key={cat} className="mb-16 max-w-3xl">
              <h2 className="text-sm tracking-widest uppercase text-muted mb-6 pb-3 border-b border-line">{cat}</h2>
              <div>
                {items.map((e: any) => (
                  <div key={e._id} className="grid grid-cols-[88px_1fr] gap-6 py-4 border-b border-line text-sm">
                    <span className="font-medium">
                      {e.anio}
                      {e.anioFin ? `–${e.anioFin}` : ''}
                    </span>
                    <div className="text-foreground/80">
                      <p>{e.titulo}</p>
                      {(e.lugar || e.ciudad || e.pais) && (
                        <p className="text-muted text-xs mt-1">{[e.lugar, e.ciudad, e.pais].filter(Boolean).join(' · ')}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })
      )}
    </div>
  )
}
