import { defineType, defineField } from 'sanity'

export const noticia = defineType({
  name: 'noticia',
  title: 'Noticia',
  type: 'document',
  fields: [
    defineField({ name: 'titulo', title: 'Título', type: 'localeString', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'titulo.es' }, validation: (r) => r.required() }),
    defineField({ name: 'fecha', title: 'Fecha', type: 'date', validation: (r) => r.required() }),
    defineField({ name: 'cuerpo', title: 'Cuerpo', type: 'localeText' }),
    defineField({ name: 'imagenDestacada', title: 'Imagen destacada', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'enlaces', title: 'Enlaces relacionados', type: 'array', of: [{ type: 'url' }] }),
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
