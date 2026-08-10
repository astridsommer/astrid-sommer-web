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
    defineField({ name: 'lugar', title: 'Galería / sede', type: 'string' }),
    defineField({ name: 'ciudad', title: 'Ciudad', type: 'string' }),
    defineField({ name: 'pais', title: 'País', type: 'string' }),
    defineField({ name: 'portada', title: 'Imagen de portada', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'textoCorto', title: 'Texto corto (para la tarjeta en Home)', type: 'string',
      description: 'Una frase breve, ej. "Exposición individual en Estepona, Málaga, España."',
    }),
    defineField({ name: 'textoCuratorial', title: 'Texto curatorial (completo)', type: 'localeText' }),
    defineField({
      name: 'fotosMontaje', title: 'Fotos de montaje / sala', type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'mostrarEnHome', title: 'Mostrar en Home', type: 'boolean',
      initialValue: false, group: 'home',
    }),
    defineField({
      name: 'mostrarEnDropdown', title: 'Mostrar en menú desplegable', type: 'boolean',
      description: 'Aparece en el submenú de "Exposiciones" del sitio.',
      initialValue: false, group: 'home',
    }),
    defineField({
      name: 'orden', title: 'Orden', type: 'number',
      description: 'Número más bajo aparece primero.',
      group: 'home',
    }),
  ],
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'home', title: 'Visibilidad en Home' },
  ],
  preview: { select: { title: 'titulo', subtitle: 'lugar' } },
})
