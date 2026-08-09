import { defineType, defineField } from 'sanity'

export const cvEntry = defineType({
  name: 'cvEntry',
  title: 'Entrada de CV',
  type: 'document',
  fields: [
    defineField({ name: 'anio', title: 'Año', type: 'number', validation: (r) => r.required() }),
    defineField({ name: 'anioFin', title: 'Año fin (opcional)', type: 'number' }),
    defineField({ name: 'titulo', title: 'Título', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'lugar', title: 'Lugar / galería / institución', type: 'string' }),
    defineField({ name: 'ciudad', title: 'Ciudad', type: 'string' }),
    defineField({ name: 'pais', title: 'País', type: 'string' }),
    defineField({
      name: 'categoria', title: 'Categoría', type: 'string',
      options: { list: ['Estudio', 'Individual', 'Colectiva', 'Premio / Bienal'] },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'orden', title: 'Orden', type: 'number', description: 'Número más bajo aparece primero.' }),
    defineField({ name: 'visible', title: 'Visible en el sitio', type: 'boolean', initialValue: true }),
  ],
  orderings: [
    { title: 'Año, más reciente primero', name: 'anioDesc', by: [{ field: 'anio', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'titulo', subtitle: 'anio' },
    prepare: ({ title, subtitle }) => ({ title, subtitle: String(subtitle ?? '') }),
  },
})
