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
    defineField({
      name: 'orden', title: 'Orden', type: 'number',
      description: 'Número más bajo aparece primero. Déjalo vacío si no importa el orden.',
      group: 'home',
    }),
    defineField({
      name: 'mostrarEnHome', title: 'Mostrar en Home', type: 'boolean',
      description: 'Actívalo para que esta obra aparezca en la portada del sitio.',
      initialValue: false, group: 'home',
    }),
    defineField({
      name: 'usarComoHero', title: 'Usar como imagen principal (Hero)', type: 'boolean',
      description: 'Aparece en el carrusel grande de la portada. Puedes activarlo en varias obras: todas entran al carrusel.',
      initialValue: false, group: 'home',
    }),
    defineField({
      name: 'obraDelMes', title: 'Obra del mes', type: 'boolean',
      description: 'Solo debería haber una obra activa a la vez con esta opción. Se muestra en la sección "Obra del mes" del Home.',
      initialValue: false, group: 'home',
    }),
  ],
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'home', title: 'Visibilidad en Home' },
  ],
  preview: {
    select: { title: 'titulo', subtitle: 'anio', media: 'imagenes.0' },
  },
})
