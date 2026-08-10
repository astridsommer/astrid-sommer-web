import { defineType, defineField } from 'sanity'

const TAMANO_NOMBRE = [
  { title: 'Pequeño', value: 'pequeno' },
  { title: 'Aprobado', value: 'aprobado' },
  { title: 'Grande', value: 'grande' },
]

const TAMANO_SECCION = [
  { title: 'Pequeño', value: 'pequeno' },
  { title: 'Aprobado', value: 'aprobado' },
  { title: 'Mediano', value: 'mediano' },
]

const TAMANO_DESCRIPTOR = [
  { title: 'Pequeño', value: 'pequeno' },
  { title: 'Aprobado', value: 'aprobado' },
]

const PESO = [
  { title: 'Thin', value: 'thin' },
  { title: 'Light', value: 'light' },
  { title: 'Regular', value: 'regular' },
]

const GRIS_3 = [
  { title: 'Gris claro', value: 'claro' },
  { title: 'Gris aprobado', value: 'aprobado' },
  { title: 'Gris medio', value: 'medio' },
]

const GRIS_2 = [
  { title: 'Gris claro', value: 'claro' },
  { title: 'Gris medio', value: 'medio' },
]

export const homePage = defineType({
  name: 'homePage',
  title: 'Home — textos y estilo',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'secciones', title: 'Secciones' },
    { name: 'visibilidad', title: 'Mostrar / ocultar secciones' },
  ],
  fields: [
    // --- Hero: textos ---
    defineField({ name: 'heroNombre', title: 'Nombre visible', type: 'string', initialValue: 'Astrid Sommer', group: 'hero' }),
    defineField({ name: 'heroNombreMostrar', title: 'Mostrar nombre', type: 'boolean', initialValue: true, group: 'hero' }),
    defineField({ name: 'heroDescriptor', title: 'Descriptor pequeño', type: 'string', group: 'hero' }),
    defineField({ name: 'heroDescriptorMostrar', title: 'Mostrar descriptor', type: 'boolean', initialValue: true, group: 'hero' }),

    // --- Hero: estilo del nombre ---
    defineField({
      name: 'heroNombreTamano', title: 'Tamaño del nombre', type: 'string',
      options: { list: TAMANO_NOMBRE, layout: 'radio' }, initialValue: 'aprobado', group: 'hero',
    }),
    defineField({
      name: 'heroNombrePeso', title: 'Peso del nombre', type: 'string',
      options: { list: PESO, layout: 'radio' }, initialValue: 'thin', group: 'hero',
    }),
    defineField({
      name: 'heroNombreColor', title: 'Color del nombre', type: 'string',
      options: { list: GRIS_3, layout: 'radio' }, initialValue: 'aprobado', group: 'hero',
    }),

    // --- Hero: estilo del descriptor ---
    defineField({
      name: 'heroDescriptorTamano', title: 'Tamaño del descriptor', type: 'string',
      options: { list: TAMANO_DESCRIPTOR, layout: 'radio' }, initialValue: 'aprobado', group: 'hero',
    }),
    defineField({
      name: 'heroDescriptorColor', title: 'Color del descriptor', type: 'string',
      options: { list: GRIS_2, layout: 'radio' }, initialValue: 'medio', group: 'hero',
    }),
    defineField({ name: 'heroDescriptorMayusculas', title: 'Descriptor en mayúsculas', type: 'boolean', initialValue: true, group: 'hero' }),

    // --- Estilo compartido de los 6 títulos de sección ---
    defineField({
      name: 'seccionTituloTamano', title: 'Tamaño de los títulos de sección', type: 'string',
      description: 'Aplica a los 6 títulos: Exposiciones, Obra del mes, Estudio, Bio, Noticias, Contacto.',
      options: { list: TAMANO_SECCION, layout: 'radio' }, initialValue: 'aprobado', group: 'secciones',
    }),
    defineField({
      name: 'seccionTituloPeso', title: 'Peso de los títulos de sección', type: 'string',
      options: { list: PESO, layout: 'radio' }, initialValue: 'thin', group: 'secciones',
    }),
    defineField({
      name: 'seccionTituloColor', title: 'Color de los títulos de sección', type: 'string',
      options: { list: GRIS_3, layout: 'radio' }, initialValue: 'claro', group: 'secciones',
    }),

    // --- Textos de los 6 títulos de sección (opcional, si vacío usa el texto por defecto) ---
    defineField({ name: 'tituloExposiciones', title: 'Texto — Exposiciones', type: 'string', group: 'secciones' }),
    defineField({ name: 'tituloObraDelMes', title: 'Texto — Obra del mes', type: 'string', group: 'secciones' }),
    defineField({ name: 'tituloEstudio', title: 'Texto — Estudio', type: 'string', group: 'secciones' }),
    defineField({ name: 'tituloBio', title: 'Texto — Bio', type: 'string', group: 'secciones' }),
    defineField({ name: 'tituloNoticias', title: 'Texto — Noticias', type: 'string', group: 'secciones' }),
    defineField({ name: 'tituloContacto', title: 'Texto — Contacto', type: 'string', group: 'secciones' }),

    // --- Visibilidad ---
    defineField({ name: 'mostrarExposiciones', title: 'Mostrar sección Exposiciones', type: 'boolean', initialValue: true, group: 'visibilidad' }),
    defineField({ name: 'mostrarObraDelMes', title: 'Mostrar sección Obra del mes', type: 'boolean', initialValue: true, group: 'visibilidad' }),
    defineField({ name: 'mostrarEstudio', title: 'Mostrar sección Estudio', type: 'boolean', initialValue: true, group: 'visibilidad' }),
    defineField({ name: 'mostrarBio', title: 'Mostrar sección Bio', type: 'boolean', initialValue: true, group: 'visibilidad' }),
    defineField({ name: 'mostrarNoticias', title: 'Mostrar sección Noticias', type: 'boolean', initialValue: true, group: 'visibilidad' }),
    defineField({ name: 'mostrarContacto', title: 'Mostrar sección Contacto', type: 'boolean', initialValue: true, group: 'visibilidad' }),
  ],
  preview: { prepare: () => ({ title: 'Home — textos y estilo' }) },
})
