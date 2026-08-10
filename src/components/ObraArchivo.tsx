'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/image'
import type { Locale } from '@/i18n/dictionary'

type ObraItem = {
  _id: string
  titulo: string
  slug: string
  anio?: number
  tecnica?: string
  disponibilidad?: string
  keywords?: string[]
  exposicionesTitulos?: string[]
  img?: any
}

const CATEGORIAS = ['Pintura', 'Fotografía', 'Escultura', 'Obra sobre papel']

export default function ObraArchivo({ obras, locale }: { obras: ObraItem[]; locale: Locale }) {
  const [filtro, setFiltro] = useState<string>('todas')
  const [busqueda, setBusqueda] = useState('')

  const filtros = [
    { value: 'todas', label: locale === 'es' ? 'Todas' : 'All' },
    ...CATEGORIAS.map((c) => ({ value: c, label: c })),
    { value: 'disponible', label: locale === 'es' ? 'Disponible' : 'Available' },
  ]

  const resultado = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    return obras.filter((o) => {
      const pasaFiltro =
        filtro === 'todas'
          ? true
          : filtro === 'disponible'
            ? o.disponibilidad === 'Disponible'
            : o.tecnica === filtro

      if (!pasaFiltro) return false
      if (!q) return true

      const searchable = [
        o.titulo,
        o.anio ? String(o.anio) : '',
        o.tecnica,
        o.disponibilidad,
        ...(o.keywords ?? []),
        ...(o.exposicionesTitulos ?? []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return searchable.includes(q)
    })
  }, [obras, filtro, busqueda])

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-6">
        {filtros.map((f) => (
          <button
            key={f.value}
            onClick={() => setFiltro(f.value)}
            className={`text-[12px] font-semibold uppercase tracking-wide transition-colors ${
              filtro === f.value ? 'text-accent' : 'text-foreground/45 hover:text-foreground/70'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <input
        type="search"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder={
          locale === 'es'
            ? 'Buscar por título, serie, año, técnica o exposición'
            : 'Search by title, series, year, medium or exhibition'
        }
        className="w-full max-w-md bg-transparent border-b border-line py-3 text-[14px] text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors mb-12"
      />

      {resultado.length === 0 ? (
        <p className="text-muted text-[12px] tracking-widest uppercase py-16 text-center">
          {locale === 'es' ? 'No se encontraron obras con ese criterio' : 'No artworks matched that search'}
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
          {resultado.map((obra) => {
            const img = obra.img ? urlForImage(obra.img) : undefined
            return (
              <Link
                key={obra._id}
                href={`/${locale}/portafolio/${obra.slug}`}
                className={`relative aspect-square overflow-hidden group ${img ? 'bg-surface' : 'border border-line/70'}`}
              >
                {img ? (
                  <Image
                    src={img.width(800).url()}
                    alt={obra.titulo}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-widest text-muted/70">
                    {obra.titulo}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
