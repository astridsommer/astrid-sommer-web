import { client } from '@/sanity/lib/client'
import type { Locale } from '@/i18n/dictionary'
import Reveal from '@/components/Reveal'
import ObraArchivo from '@/components/ObraArchivo'
import { PAGE_TITLE, PAGE_TITLE_WRAP } from '@/lib/homeStyles'

export const revalidate = 60

async function getObras() {
  try {
    return await client.fetch(
      `*[_type == "obra"] | order(anio desc){ _id, titulo, "slug": slug.current, anio, tecnica, disponibilidad, keywords, "exposicionesTitulos": exposiciones[]->titulo, "img": imagenes[0] }`,
    )
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
        <h1 className={`${PAGE_TITLE} ${PAGE_TITLE_WRAP}`}>{locale === 'es' ? 'Obra' : 'Work'}</h1>
      </Reveal>

      {obras.length === 0 ? (
        <p className="text-muted text-sm tracking-widest uppercase py-24 text-center">
          {locale === 'es' ? 'Obra en proceso de carga' : 'Work being uploaded'}
        </p>
      ) : (
        <ObraArchivo obras={obras} locale={locale} />
      )}
    </div>
  )
}
