import { defineType, defineField } from 'sanity'

export const localeString = defineType({
  name: 'localeString',
  title: 'Texto (ES/EN)',
  type: 'object',
  fields: [
    defineField({ name: 'es', title: 'Español', type: 'string' }),
    defineField({ name: 'en', title: 'English', type: 'string' }),
  ],
})

export const localeText = defineType({
  name: 'localeText',
  title: 'Texto largo (ES/EN)',
  type: 'object',
  fields: [
    defineField({ name: 'es', title: 'Español', type: 'text' }),
    defineField({ name: 'en', title: 'English', type: 'text' }),
  ],
})
