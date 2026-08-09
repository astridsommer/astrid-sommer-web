import { defineType, defineField } from 'sanity'

export const bio = defineType({
  name: 'bio',
  title: 'Bio',
  type: 'document',
  fields: [
    defineField({ name: 'texto', title: 'Texto biográfico completo', type: 'localeText' }),
    defineField({
      name: 'resumenHome', title: 'Resumen corto (para Home)', type: 'localeText',
      description: 'Versión breve que se muestra en la portada, no el texto completo.',
    }),
    defineField({ name: 'statement', title: 'Artist statement', type: 'localeText' }),
    defineField({ name: 'foto', title: 'Foto de la artista', type: 'image' }),
    defineField({ name: 'estudios', title: 'Estudios', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'premios', title: 'Premios y bienales', type: 'array', of: [{ type: 'string' }] }),
    defineField({
      name: 'hitos', title: 'Hitos destacados en Home', type: 'array',
      description: 'Los 2-3 momentos que quieres mostrar debajo del resumen en Home.',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'anio', title: 'Año', type: 'string' }),
          defineField({ name: 'texto', title: 'Texto', type: 'string' }),
        ],
        preview: { select: { title: 'texto', subtitle: 'anio' } },
      }],
    }),
  ],
  preview: { select: { title: 'texto.es' } },
})
