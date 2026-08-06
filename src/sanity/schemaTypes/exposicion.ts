import { defineType, defineField } from 'sanity'

export const exposicion = defineType({
  name: 'exposicion',
  title: 'Exposición',
  type: 'document',
  fields: [
    defineField({ name: 'titulo', title: 'Título', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'titulo' } }),
    defineField({ name: 'tipo', title: 'Tipo', type: 'string', options: { list: ['Individual', 'Colectiva'] } }),
    defineField({ name: 'fechaInicio', title: 'Fecha inicio', type: 'date' }),
    defineField({ name: 'fechaFin', title: 'Fecha fin', type: 'date' }),
    defineField({ name: 'lugar', title: 'Lugar / galería / ciudad / país', type: 'string' }),
    defineField({ name: 'textoCuratorial', title: 'Texto curatorial', type: 'localeText' }),
  ],
  preview: { select: { title: 'titulo', subtitle: 'lugar' } },
})
