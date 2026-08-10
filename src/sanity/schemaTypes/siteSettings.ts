import { defineType, defineField } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Contacto y ajustes del sitio',
  type: 'document',
  fields: [
    defineField({ name: 'correo', title: 'Correo de contacto', type: 'string' }),
    defineField({ name: 'whatsapp', title: 'WhatsApp (número o enlace wa.me)', type: 'string' }),
    defineField({ name: 'instagram', title: 'Instagram (usuario o enlace)', type: 'string' }),
    defineField({
      name: 'catalogoActivo', title: 'Mostrar catálogo descargable', type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'catalogoArchivo', title: 'Archivo de catálogo (PDF)', type: 'file',
      hidden: ({ document }) => !document?.catalogoActivo,
    }),
    defineField({ name: 'footerTexto', title: 'Texto del pie de página', type: 'string' }),
    defineField({ name: 'avisoPrivacidadUrl', title: 'Enlace externo a aviso de privacidad (opcional)', type: 'url' }),
    defineField({ name: 'derechosImagenUrl', title: 'Enlace externo a derechos de imagen / reproducción (opcional)', type: 'url' }),
    defineField({
      name: 'avisoPrivacidadTexto', title: 'Texto — Aviso de privacidad', type: 'text', rows: 10,
      description: 'Contenido de la página pública /aviso-privacidad. Si lo dejas vacío, se muestra un texto genérico temporal.',
    }),
    defineField({
      name: 'derechosImagenTexto', title: 'Texto — Derechos de imagen y reproducción', type: 'text', rows: 10,
      description: 'Contenido de la página pública /derechos-imagen. Si lo dejas vacío, se muestra un texto genérico temporal.',
    }),
  ],
  preview: { prepare: () => ({ title: 'Contacto y ajustes del sitio' }) },
})
