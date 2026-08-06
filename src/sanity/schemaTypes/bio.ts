import { defineType, defineField } from 'sanity'

export const bio = defineType({
  name: 'bio',
  title: 'Bio',
  type: 'document',
  fields: [
    defineField({ name: 'texto', title: 'Texto biográfico', type: 'localeText' }),
    defineField({ name: 'statement', title: 'Artist statement', type: 'localeText' }),
    defineField({ name: 'foto', title: 'Foto de la artista', type: 'image' }),
    defineField({ name: 'estudios', title: 'Estudios', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'premios', title: 'Premios y bienales', type: 'array', of: [{ type: 'string' }] }),
  ],
  preview: { select: { title: 'texto.es' } },
})
