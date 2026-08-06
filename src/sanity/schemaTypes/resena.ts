import { defineType, defineField } from 'sanity'

export const resena = defineType({
  name: 'resena',
  title: 'Reseña',
  type: 'document',
  fields: [
    defineField({ name: 'autor', title: 'Autor / crítico', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'medio', title: 'Medio de publicación', type: 'string' }),
    defineField({ name: 'fecha', title: 'Fecha', type: 'date' }),
    defineField({ name: 'exposicion', title: 'Exposición reseñada', type: 'reference', to: [{ type: 'exposicion' }] }),
    defineField({ name: 'texto', title: 'Texto / extracto', type: 'text' }),
    defineField({ name: 'fuenteUrl', title: 'Enlace a fuente original', type: 'url' }),
  ],
  preview: { select: { title: 'autor', subtitle: 'medio' } },
})
