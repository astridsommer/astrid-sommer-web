import { defineType, defineField } from 'sanity'

export const obra = defineType({
  name: 'obra',
  title: 'Obra',
  type: 'document',
  fields: [
    defineField({ name: 'titulo', title: 'Título', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'titulo' }, validation: (r) => r.required() }),
    defineField({ name: 'anio', title: 'Año', type: 'number' }),
    defineField({
      name: 'tecnica', title: 'Técnica / medio', type: 'string',
      options: { list: ['Pintura', 'Fotografía', 'Escultura', 'Grabado / Monotipia / Acuarela'] },
    }),
    defineField({ name: 'medidas', title: 'Medidas', type: 'string' }),
    defineField({ name: 'imagenes', title: 'Imágenes', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
    defineField({
      name: 'disponibilidad', title: 'Disponibilidad', type: 'string',
      options: { list: ['Disponible', 'Consultar', 'Vendida'] }, initialValue: 'Consultar',
    }),
    defineField({ name: 'exposiciones', title: 'Exposiciones relacionadas', type: 'array', of: [{ type: 'reference', to: [{ type: 'exposicion' }] }] }),
  ],
  preview: {
    select: { title: 'titulo', subtitle: 'anio', media: 'imagenes.0' },
  },
})
