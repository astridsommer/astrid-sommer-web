import { client } from '@/sanity/lib/client'
import { urlForImage } from '@/sanity/lib/image'
import { site, type Locale } from '@/i18n/dictionary'
import Reveal from '@/components/Reveal'
import HeroCarousel from '@/components/HeroCarousel'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 60

const OBRA_PROJECTION = `{ _id, titulo, "slug": slug.current, anio, tecnica, medidas, disponibilidad, "img": imagenes[0] }`

async function getHomeData() {
  const [heroObras, exposiciones, obraDelMes, estudioObras, bioDoc, noticias, settings] = await Promise.all([
    client.fetch(`*[_type == "obra" && usarComoHero == true] | order(orden asc) ${OBRA_PROJECTION}`).catch(() => []),
    client
      .fetch(`*[_type == "exposicion" && mostrarEnHome == true] | order(orden asc){ _id, titulo, "slug": slug.current, fechaInicio, lugar, ciudad, pais, textoCorto, "portada": portada }`)
      .catch(() => []),
    client.fetch(`*[_type == "obra" && obraDelMes == true][0] ${OBRA_PROJECTION}`).catch(() => null),
    client
      .fetch(`*[_type == "obra" && mostrarEnHome == true && obraDelMes != true && usarComoHero != true] | order(orden asc)[0...3] ${OBRA_PROJECTION}`)
      .catch(() => []),
    client.fetch(`*[_type == "bio"][0]{ resumenHome, hitos }`).catch(() => null),
    client
      .fetch(`*[_type == "noticia" && estado == "publicado"] | order(destacada desc, fecha desc)[0...3]{ _id, titulo, "slug": slug.current, fecha, tipo, extracto, imagenDestacada }`)
      .catch(() => []),
    client.fetch(`*[_type == "siteSettings"][0]{ correo, whatsapp, instagram, catalogoActivo }`).catch(() => null),
  ])

  return { heroObras, exposiciones, obraDelMes, estudioObras, bioDoc, noticias, settings }
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale }
  const { heroObras, exposiciones, obraDelMes, estudioObras, bioDoc, noticias, settings } = await getHomeData()

  const heroImages = (heroObras.length > 0 ? heroObras : []).flatMap((o: any) => {
    const url = o.img ? urlForImage(o.img)?.width(1400).url() : undefined
    return url ? [{ url, alt: o.titulo || 'Astrid Sommer' }] : []
  })

  return (
    <div>
      {/* Hero */}
      <section className="min-h-[90vh] grid md:grid-cols-[.9fr_1.1fr] gap-10 md:gap-16 items-center px-6 md:px-12 pt-32 pb-16">
        <Reveal>
          <p className="text-[13px] tracking-[0.2em] uppercase text-muted mb-4">{site[locale].heroSubtitle}</p>
          <h1 className="font-serif italic text-5xl md:text-7xl leading-[1.05]">{site[locale].heroTitle}</h1>
        </Reveal>
        <Reveal delay={0.15}>
          {heroImages.length > 0 ? (
            <HeroCarousel images={heroImages} />
          ) : (
            <div className="aspect-[4/5] md:aspect-[3/4] bg-surface flex items-center justify-center text-muted text-sm tracking-widest uppercase text-center px-6">
              {locale === 'es'
                ? 'Marca alguna obra como "Usar como Hero" en el panel para que aparezca aquí'
                : 'Mark an artwork as "Use as Hero" in the panel to show it here'}
            </div>
          )}
        </Reveal>
      </section>

      {/* Exposiciones */}
      {exposiciones.length > 0 && (
        <section className="py-16 md:py-24 px-6 md:px-12">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-light text-foreground/40 mb-10">
              {locale === 'es' ? 'Exposiciones' : 'Exhibitions'}
            </h2>
          </Reveal>
          <div className="flex gap-6 md:gap-10 overflow-x-auto pb-4 -mx-6 px-6 md:-mx-12 md:px-12">
            {exposiciones.map((expo: any) => {
              const img = expo.portada ? urlForImage(expo.portada)?.width(900).url() : undefined
              const lugarCorto = [expo.lugar, expo.ciudad].filter(Boolean).join(' · ')
              const anio = expo.fechaInicio ? new Date(expo.fechaInicio).getFullYear() : ''
              return (
                <Link key={expo._id} href={`/${locale}/exposiciones`} className="group block shrink-0 w-[280px] md:w-[420px]">
                  <div className="relative aspect-[4/5] bg-surface overflow-hidden mb-4">
                    {img && <Image src={img} alt={expo.titulo} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-700" />}
                  </div>
                  <div className="flex justify-between text-xs tracking-widest uppercase text-muted mb-2">
                    <span>Expo</span>
                    <span>{[anio, lugarCorto].filter(Boolean).join(' · ')}</span>
                  </div>
                  <p className="font-serif italic text-lg mb-1">{expo.titulo}</p>
                  {expo.textoCorto && <p className="text-sm text-muted leading-relaxed">{expo.textoCorto}</p>}
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Obra del mes */}
      {obraDelMes && (
        <section className="py-16 md:py-24 px-6 md:px-12">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-light text-foreground/40 mb-10">
              {locale === 'es' ? 'Obra del mes' : 'Featured work'}
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-[1fr_1fr] gap-10 md:gap-16 items-end">
            <Reveal>
              <div className="relative aspect-[4/5] bg-surface overflow-hidden">
                {obraDelMes.img && (
                  <Image src={urlForImage(obraDelMes.img)!.width(1200).url()} alt={obraDelMes.titulo} fill className="object-cover" />
                )}
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <dl className="grid grid-cols-[110px_1fr] gap-y-4 text-sm border-t border-line pt-6">
                <dt className="text-muted uppercase tracking-widest text-xs">{locale === 'es' ? 'Título' : 'Title'}</dt>
                <dd>{obraDelMes.titulo}</dd>
                {obraDelMes.tecnica && (
                  <>
                    <dt className="text-muted uppercase tracking-widest text-xs">{locale === 'es' ? 'Técnica' : 'Medium'}</dt>
                    <dd>{obraDelMes.tecnica}</dd>
                  </>
                )}
                {obraDelMes.medidas && (
                  <>
                    <dt className="text-muted uppercase tracking-widest text-xs">{locale === 'es' ? 'Medidas' : 'Size'}</dt>
                    <dd>{obraDelMes.medidas}</dd>
                  </>
                )}
                <dt className="text-muted uppercase tracking-widest text-xs">{locale === 'es' ? 'Estado' : 'Status'}</dt>
                <dd>{obraDelMes.disponibilidad}</dd>
              </dl>
              <Link href={`/${locale}/contacto`} className="inline-block mt-8 text-[13px] tracking-[0.1em] uppercase border-b border-accent pb-1 hover:opacity-70 transition-opacity">
                {site[locale].cta} →
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* Estudio */}
      {estudioObras.length > 0 && (
        <section className="py-16 md:py-24 px-6 md:px-12 border-t border-line">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-light text-foreground/40 mb-10">
              {locale === 'es' ? 'Estudio' : 'Studio'}
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6 md:gap-10">
            {estudioObras.map((o: any) => (
              <Reveal key={o._id}>
                <div className="relative aspect-[3/4] bg-surface overflow-hidden mb-4">
                  {o.img && <Image src={urlForImage(o.img)!.width(800).url()} alt={o.titulo} fill className="object-cover" />}
                </div>
                <p className="font-serif italic text-lg">{o.titulo}</p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Bio resumida */}
      {bioDoc?.resumenHome?.[locale] && (
        <section className="py-16 md:py-24 px-6 md:px-12 border-t border-line grid md:grid-cols-[.7fr_1.3fr] gap-10 md:gap-16">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-light text-foreground/40">Bio</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lg md:text-xl leading-relaxed text-foreground/80 mb-8">{bioDoc.resumenHome[locale]}</p>
            {Array.isArray(bioDoc.hitos) && bioDoc.hitos.length > 0 && (
              <div className="border-t border-line">
                {bioDoc.hitos.map((h: any, i: number) => (
                  <div key={i} className="grid grid-cols-[80px_1fr] gap-4 py-4 border-b border-line text-sm">
                    <span className="font-medium">{h.anio}</span>
                    <span className="text-muted">{h.texto}</span>
                  </div>
                ))}
              </div>
            )}
            <Link href={`/${locale}/bio`} className="inline-block mt-6 text-[13px] tracking-[0.1em] uppercase text-muted hover:text-foreground transition-colors">
              {locale === 'es' ? 'Ver biografía completa →' : 'Full biography →'}
            </Link>
          </Reveal>
        </section>
      )}

      {/* Noticias */}
      {noticias.length > 0 && (
        <section className="py-16 md:py-24 px-6 md:px-12 border-t border-line">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-light text-foreground/40 mb-10">
              {locale === 'es' ? 'Noticias' : 'News'}
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6 md:gap-10">
            {noticias.map((n: any) => {
              const img = n.imagenDestacada ? urlForImage(n.imagenDestacada)?.width(800).url() : undefined
              return (
                <Reveal key={n._id}>
                  <Link href={`/${locale}/noticias`} className="group block">
                    <div className="relative aspect-[5/4] bg-surface overflow-hidden mb-4">
                      {img && <Image src={img} alt={n.titulo?.[locale] ?? ''} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-700" />}
                    </div>
                    <div className="flex justify-between text-xs tracking-widest uppercase text-muted mb-2">
                      <span>{n.tipo || (locale === 'es' ? 'Noticia' : 'News')}</span>
                      <span>{n.fecha}</span>
                    </div>
                    <p className="font-serif italic text-lg">{n.titulo?.[locale]}</p>
                  </Link>
                </Reveal>
              )
            })}
          </div>
          <Link href={`/${locale}/noticias`} className="inline-block mt-10 text-[13px] tracking-[0.1em] uppercase text-muted hover:text-foreground transition-colors">
            {locale === 'es' ? 'Más noticias →' : 'More news →'}
          </Link>
        </section>
      )}

      {/* Contacto */}
      <section className="py-16 md:py-24 px-6 md:px-12 border-t border-line">
        <Reveal>
          <h2 className="text-3xl md:text-5xl font-light text-foreground/40 mb-10">Contacto</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="grid gap-0 max-w-xl">
            <a href={settings?.correo ? `mailto:${settings.correo}` : `/${locale}/contacto`} className="flex justify-between items-center py-4 border-t border-line uppercase text-sm tracking-widest hover:text-accent transition-colors">
              {site[locale].cta} <span>↗</span>
            </a>
            {settings?.whatsapp && (
              <a href={settings.whatsapp.startsWith('http') ? settings.whatsapp : `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex justify-between items-center py-4 border-t border-line uppercase text-sm tracking-widest hover:text-accent transition-colors">
                WhatsApp <span>↗</span>
              </a>
            )}
            {settings?.instagram && (
              <a href={settings.instagram.startsWith('http') ? settings.instagram : `https://instagram.com/${settings.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="flex justify-between items-center py-4 border-t border-line uppercase text-sm tracking-widest hover:text-accent transition-colors">
                Instagram <span>↗</span>
              </a>
            )}
            <div className="py-4 border-t border-b border-line" />
          </div>
        </Reveal>
      </section>
    </div>
  )
}
