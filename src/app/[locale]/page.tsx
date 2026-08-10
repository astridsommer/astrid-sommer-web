import { client } from '@/sanity/lib/client'
import { urlForImage } from '@/sanity/lib/image'
import { site, type Locale } from '@/i18n/dictionary'
import Reveal from '@/components/Reveal'
import HeroCarousel from '@/components/HeroCarousel'
import Link from 'next/link'
import Image from 'next/image'
import { heroNombreClases, heroDescriptorClases, seccionTituloClases } from '@/lib/homeStyles'
import ContactRow from '@/components/ContactRow'

export const revalidate = 60

const OBRA_PROJECTION = `{ _id, titulo, "slug": slug.current, anio, tecnica, medidas, disponibilidad, "img": imagenes[0] }`

const CARD_TITLE = 'font-sans font-normal text-[clamp(18px,1.35vw,22px)] leading-[1.1] text-foreground/62'

const HOME_PAGE_PROJECTION = `{
  heroNombre, heroNombreMostrar, heroDescriptor, heroDescriptorMostrar,
  heroNombreTamano, heroNombrePeso, heroNombreColor,
  heroDescriptorTamano, heroDescriptorColor, heroDescriptorMayusculas,
  seccionTituloTamano, seccionTituloPeso, seccionTituloColor,
  tituloExposiciones, tituloObraDelMes, tituloEstudio, tituloBio, tituloNoticias, tituloContacto,
  mostrarExposiciones, mostrarObraDelMes, mostrarEstudio, mostrarBio, mostrarNoticias, mostrarContacto
}`

function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-dashed border-line rounded-sm py-10 px-6 text-center text-muted text-[12px] tracking-wide uppercase bg-surface/60">
      {children}
    </div>
  )
}

async function getHomeData() {
  const [heroObras, exposiciones, obraDelMes, estudioObras, bioDoc, noticias, settings, homePageDoc] = await Promise.all([
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
    client
      .fetch(`*[_type == "siteSettings"][0]{ correo, whatsapp, instagram, catalogoActivo, "catalogoUrl": catalogoArchivo.asset->url }`)
      .catch(() => null),
    client.fetch(`*[_type == "homePage"][0] ${HOME_PAGE_PROJECTION}`).catch(() => null),
  ])

  return { heroObras, exposiciones, obraDelMes, estudioObras, bioDoc, noticias, settings, homePageDoc }
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params as { locale: Locale }
  const { heroObras, exposiciones, obraDelMes, estudioObras, bioDoc, noticias, settings, homePageDoc: hp } = await getHomeData()

  const t = (override: string | undefined | null, fallback: string) => (override && override.trim() ? override : fallback)
  const H2 = seccionTituloClases(hp)
  const show = (v: boolean | undefined | null) => v !== false

  const heroImages = (heroObras.length > 0 ? heroObras : []).flatMap((o: any) => {
    const url = o.img ? urlForImage(o.img)?.width(1400).url() : undefined
    return url ? [{ url, alt: o.titulo || 'Astrid Sommer' }] : []
  })

  return (
    <div>
      {/* 1. Hero — altura = viewport menos el header, para que sea "la portada", no un banner */}
      <section className="h-[calc(100svh-76px)] md:h-[calc(100svh-96px)] grid md:grid-cols-[.5fr_1.5fr] gap-8 md:gap-16 px-6 md:px-12 pt-24 md:pt-28 pb-10">
        <div className="self-end">
          <Reveal>
            {show(hp?.heroDescriptorMostrar) && (
              <p className={`flex items-center gap-2.5 font-medium tracking-wide text-foreground/45 mb-3 ${heroDescriptorClases(hp)}`}>
                <span className="w-8 h-px bg-foreground/25" />
                {t(hp?.heroDescriptor, site[locale].heroSubtitle)}
              </p>
            )}
            {show(hp?.heroNombreMostrar) && (
              <h1 className={`font-sans leading-none max-w-[13ch] ${heroNombreClases(hp)}`}>
                {t(hp?.heroNombre, site[locale].heroTitle)}
              </h1>
            )}
          </Reveal>
        </div>
        <Reveal delay={0.15} className="h-full min-h-0">
          {heroImages.length > 0 ? (
            <HeroCarousel images={heroImages} />
          ) : (
            <div className="h-full bg-surface flex items-center justify-center text-muted text-[12px] tracking-widest uppercase text-center px-6">
              {locale === 'es'
                ? 'Marca alguna obra como "Usar como Hero" en el panel para que aparezca aquí'
                : 'Mark an artwork as "Use as Hero" in the panel to show it here'}
            </div>
          )}
        </Reveal>
      </section>

      {/* 2. Exposiciones — margen intencional para que no quede pegada al hero */}
      {show(hp?.mostrarExposiciones) && (
      <section className="pt-24 md:pt-36 pb-14 md:pb-20 px-6 md:px-12">
        <Reveal>
          <h2 className={`${H2} mb-8 md:mb-12`}>{t(hp?.tituloExposiciones, locale === 'es' ? 'Exposiciones' : 'Exhibitions')}</h2>
        </Reveal>
        {exposiciones.length > 0 ? (
          <div className="flex gap-6 md:gap-10 overflow-x-auto pb-4 -mx-6 px-6 md:-mx-12 md:px-12">
            {exposiciones.map((expo: any) => {
              const img = expo.portada ? urlForImage(expo.portada)?.width(900).url() : undefined
              const lugarCorto = [expo.lugar, expo.ciudad].filter(Boolean).join(' · ')
              const anio = expo.fechaInicio ? new Date(expo.fechaInicio).getFullYear() : ''
              return (
                <Link key={expo._id} href={`/${locale}/exposiciones`} className="group block shrink-0 w-[280px] md:w-[420px]">
                  <div className="relative aspect-[4/5] bg-surface overflow-hidden">
                    {img && <Image src={img} alt={expo.titulo} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-700" />}
                  </div>
                  <div className="flex justify-between text-[12px] font-semibold uppercase tracking-wide text-muted mt-4">
                    <span>Expo</span>
                    <span>{[anio, lugarCorto].filter(Boolean).join(' · ')}</span>
                  </div>
                  <h3 className={`${CARD_TITLE} mt-3.5`}>{expo.titulo}</h3>
                  {expo.textoCorto && (
                    <p className="mt-2.5 text-[13px] leading-relaxed text-foreground/52">{expo.textoCorto}</p>
                  )}
                  <span className="inline-flex items-center gap-2 mt-4 text-[12px] font-bold uppercase tracking-wide text-foreground/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-foreground/40" />
                    {locale === 'es' ? 'Ver exposición' : 'View exhibition'}
                  </span>
                </Link>
              )
            })}
          </div>
        ) : (
          <Placeholder>
            {locale === 'es'
              ? 'Marca exposiciones con "Mostrar en Home" en el panel para que aparezcan aquí'
              : 'Mark exhibitions "Show on Home" in the panel to show them here'}
          </Placeholder>
        )}
      </section>
      )}

      {/* 3. Obra del mes */}
      {show(hp?.mostrarObraDelMes) && (
      <section className="py-14 md:py-20 px-6 md:px-12">
        <Reveal>
          <h2 className={`${H2} mb-8 md:mb-12`}>{t(hp?.tituloObraDelMes, locale === 'es' ? 'Obra del mes' : 'Featured work')}</h2>
        </Reveal>
        {obraDelMes ? (
          <div className="grid md:grid-cols-[1fr_1fr] gap-10 md:gap-16 items-end">
            <Reveal>
              <div className="relative aspect-[4/5] bg-surface overflow-hidden">
                {obraDelMes.img && (
                  <Image src={urlForImage(obraDelMes.img)!.width(1200).url()} alt={obraDelMes.titulo} fill className="object-cover" />
                )}
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <dl className="grid grid-cols-[110px_1fr] gap-y-4 text-[14px] border-t border-line pt-6">
                <dt className="text-muted font-bold uppercase tracking-wide text-[11px]">{locale === 'es' ? 'Título' : 'Title'}</dt>
                <dd className="text-foreground/80">{obraDelMes.titulo}</dd>
                {obraDelMes.tecnica && (
                  <>
                    <dt className="text-muted font-bold uppercase tracking-wide text-[11px]">{locale === 'es' ? 'Técnica' : 'Medium'}</dt>
                    <dd className="text-foreground/80">{obraDelMes.tecnica}</dd>
                  </>
                )}
                {obraDelMes.medidas && (
                  <>
                    <dt className="text-muted font-bold uppercase tracking-wide text-[11px]">{locale === 'es' ? 'Medidas' : 'Size'}</dt>
                    <dd className="text-foreground/80">{obraDelMes.medidas}</dd>
                  </>
                )}
                <dt className="text-muted font-bold uppercase tracking-wide text-[11px]">{locale === 'es' ? 'Estado' : 'Status'}</dt>
                <dd className="text-foreground/80">{obraDelMes.disponibilidad}</dd>
              </dl>
              <Link href={`/${locale}/contacto`} className="inline-block mt-8 text-[13px] tracking-[0.1em] uppercase border-b border-accent pb-1 hover:opacity-70 transition-opacity">
                {site[locale].cta} →
              </Link>
            </Reveal>
          </div>
        ) : (
          <Placeholder>
            {locale === 'es'
              ? 'Marca una obra como "Obra del mes" en el panel para que aparezca aquí'
              : 'Mark an artwork as "Featured work" in the panel to show it here'}
          </Placeholder>
        )}
      </section>
      )}

      {/* 4. Estudio */}
      {show(hp?.mostrarEstudio) && (
      <section className="py-14 md:py-20 px-6 md:px-12 border-t border-line">
        <Reveal>
          <h2 className={`${H2} mb-8 md:mb-12`}>{t(hp?.tituloEstudio, locale === 'es' ? 'Estudio' : 'Studio')}</h2>
        </Reveal>
        {estudioObras.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6 md:gap-10">
            {estudioObras.map((o: any) => (
              <Reveal key={o._id}>
                <div className="relative aspect-[3/4] bg-surface overflow-hidden mb-4">
                  {o.img && <Image src={urlForImage(o.img)!.width(800).url()} alt={o.titulo} fill className="object-cover" />}
                </div>
                <h3 className="font-sans font-medium text-[clamp(19px,1.5vw,24px)] leading-[1.1] text-foreground/68">{o.titulo}</h3>
              </Reveal>
            ))}
          </div>
        ) : (
          <Placeholder>
            {locale === 'es'
              ? 'Marca hasta 3 obras con "Mostrar en Home" para llenar esta sección'
              : 'Mark up to 3 artworks "Show on Home" to fill this section'}
          </Placeholder>
        )}
      </section>
      )}

      {/* 5. Bio */}
      {show(hp?.mostrarBio) && (
      <section className="py-14 md:py-20 px-6 md:px-12 border-t border-line grid md:grid-cols-[.72fr_1.28fr] gap-10 md:gap-16">
        <Reveal>
          <h2 className={H2}>{t(hp?.tituloBio, 'Bio')}</h2>
        </Reveal>
        <Reveal delay={0.1}>
          {bioDoc?.resumenHome?.[locale] ? (
            <>
              <p className="text-[clamp(16px,1.3vw,19px)] leading-[1.65] text-foreground/68 mb-6">{bioDoc.resumenHome[locale]}</p>
              {Array.isArray(bioDoc.hitos) && bioDoc.hitos.length > 0 && (
                <div className="border-t border-line">
                  {bioDoc.hitos.map((h: any, i: number) => (
                    <div key={i} className="grid grid-cols-[80px_1fr] gap-4 py-4 border-b border-line text-[14px] text-foreground/66">
                      <time className="text-foreground font-bold">{h.anio}</time>
                      <span>{h.texto}</span>
                    </div>
                  ))}
                </div>
              )}
              <Link href={`/${locale}/bio`} className="inline-block mt-6 text-[12px] font-bold tracking-wide uppercase text-foreground/56 hover:text-accent transition-colors">
                {locale === 'es' ? 'Ver biografía completa →' : 'Full biography →'}
              </Link>
            </>
          ) : (
            <Placeholder>
              {locale === 'es'
                ? 'Completa "Resumen corto (para Home)" en Bio para llenar esta sección'
                : 'Fill in the Home summary field in Bio to show it here'}
            </Placeholder>
          )}
        </Reveal>
      </section>
      )}

      {/* 6. Noticias */}
      {show(hp?.mostrarNoticias) && (
      <section className="py-14 md:py-20 px-6 md:px-12 border-t border-line">
        <Reveal>
          <h2 className={`${H2} mb-8 md:mb-12`}>{t(hp?.tituloNoticias, locale === 'es' ? 'Noticias' : 'News')}</h2>
        </Reveal>
        {noticias.length > 0 ? (
          <>
            <div className="grid md:grid-cols-3 gap-6 md:gap-10">
              {noticias.map((n: any) => {
                const img = n.imagenDestacada ? urlForImage(n.imagenDestacada)?.width(800).url() : undefined
                return (
                  <Reveal key={n._id}>
                    <Link href={`/${locale}/noticias`} className="group block">
                      <div className="relative aspect-[1/.82] bg-surface overflow-hidden mb-4">
                        {img ? (
                          <Image src={img} alt={n.titulo?.[locale] ?? ''} fill className="object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-muted text-[11px] uppercase tracking-widest">
                            {locale === 'es' ? 'Sin imagen' : 'No image'}
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between text-[12px] font-semibold uppercase tracking-wide text-muted mb-2">
                        <span>{n.tipo || (locale === 'es' ? 'Noticia' : 'News')}</span>
                        <span>{n.fecha}</span>
                      </div>
                      <h3 className="font-sans font-medium text-[clamp(20px,1.7vw,26px)] leading-[1.1] text-foreground/85">{n.titulo?.[locale]}</h3>
                    </Link>
                  </Reveal>
                )
              })}
            </div>
            <Link href={`/${locale}/noticias`} className="inline-flex items-center gap-2.5 mt-10 text-[12px] font-bold tracking-wide uppercase text-foreground/56 hover:text-accent transition-colors">
              <span className="w-8 h-px bg-foreground/30" />
              {locale === 'es' ? 'Más noticias' : 'More news'}
            </Link>
          </>
        ) : (
          <Placeholder>
            {locale === 'es' ? 'Publica una noticia en el panel para que aparezca aquí' : 'Publish a news item in the panel to show it here'}
          </Placeholder>
        )}
      </section>
      )}

      {/* 7. Contacto */}
      {show(hp?.mostrarContacto) && (
      <section className="min-h-[64vh] md:min-h-[74vh] flex items-end px-6 md:px-12 py-14 md:py-20 border-t border-line">
        <div className="grid md:grid-cols-[1fr_.5fr] gap-8 md:gap-20 items-end w-full">
          <Reveal>
            <h2 className={H2}>{t(hp?.tituloContacto, 'Contacto')}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="w-full md:max-w-[480px] md:justify-self-end grid">
              <ContactRow
                href={settings?.correo ? `mailto:${settings.correo}` : `/${locale}/contacto`}
                label={site[locale].cta}
                icon="mail"
              />
              {settings?.whatsapp && (
                <ContactRow
                  href={settings.whatsapp.startsWith('http') ? settings.whatsapp : `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                  label="WhatsApp"
                  icon="whatsapp"
                  external
                />
              )}
              {settings?.catalogoActivo && settings?.catalogoUrl && (
                <ContactRow href={settings.catalogoUrl} label={locale === 'es' ? 'Catálogo' : 'Catalogue'} icon="catalogo" external />
              )}
              {settings?.instagram && (
                <ContactRow
                  href={settings.instagram.startsWith('http') ? settings.instagram : `https://instagram.com/${settings.instagram.replace('@', '')}`}
                  label="Instagram"
                  icon="instagram"
                  external
                />
              )}
              <div className="border-t border-line/70 h-px" />
            </div>
          </Reveal>
        </div>
      </section>
      )}
    </div>
  )
}
