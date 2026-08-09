import { defineType, defineField } from 'sanity'

export const noticia = defineType({
  name: 'noticia',
  title: 'Noticia',
  type: 'document',
  fields: [
    defineField({ name: 'titulo', title: 'Título', type: 'localeString', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'titulo.es' }, validation: (r) => r.required() }),
    defineField({ name: 'fecha', title: 'Fecha', type: 'date', validation: (r) => r.required() }),
    defineField({
      name: 'tipo', title: 'Tipo', type: 'string',
      options: { list: ['Exposición', 'Reseña', 'Estudio', 'Catálogo', 'Feria', 'Otro'] },
    }),
    defineField({ name: 'fuente', title: 'Autor / medio (opcional)', type: 'string' }),
    defineField({ name: 'extracto', title: 'Extracto (resumen corto)', type: 'localeText' }),
    defineField({ name: 'cuerpo', title: 'Texto completo', type: 'localeText' }),
    defineField({ name: 'imagenDestacada', title: 'Imagen principal', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'galeria', title: 'Galería de imágenes adicionales', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'enlaces', title: 'Enlaces relacionados', type: 'array', of: [{ type: 'url' }] }),
    defineField({
      name: 'destacada', title: 'Destacada en Home', type: 'boolean',
      description: 'Si hay varias marcadas, se muestra la más reciente por fecha.',
      initialValue: false,
    }),
    defineField({
      name: 'estado', title: 'Estado', type: 'string',
      options: { list: [{ title: 'Borrador', value: 'borrador' }, { title: 'Publicado', value: 'publicado' }] },
      initialValue: 'borrador',
    }),
  ],
  orderings: [
    { title: 'Fecha, más reciente primero', name: 'fechaDesc', by: [{ field: 'fecha', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'titulo.es', subtitle: 'fecha', media: 'imagenDestacada' },
  },
})
