import type { StructureResolver } from 'sanity/structure'

const SINGLETONS = ['bio', 'siteSettings', 'homePage']

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Astrid Sommer — Panel de contenido')
    .items([
      S.listItem()
        .title('Home')
        .child(S.document().schemaType('homePage').documentId('homePage').title('Home — textos y estilo')),

      S.listItem()
        .title('Bio')
        .child(S.documentTypeList('bio').title('Bio')),

      S.listItem()
        .title('Contacto y ajustes')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings').title('Contacto y ajustes')),

      S.divider(),

      S.listItem()
        .title('Obras')
        .child(S.documentTypeList('obra').title('Obras')),

      S.listItem()
        .title('Exposiciones')
        .child(S.documentTypeList('exposicion').title('Exposiciones')),

      S.listItem()
        .title('Noticias')
        .child(S.documentTypeList('noticia').title('Noticias')),

      S.listItem()
        .title('Reseñas')
        .child(S.documentTypeList('resena').title('Reseñas')),

      S.listItem()
        .title('CV')
        .child(S.documentTypeList('cvEntry').title('Entradas de CV')),

      S.divider(),

      ...S.documentTypeListItems().filter(
        (item) => !SINGLETONS.includes(item.getId() as string) &&
          !['obra', 'exposicion', 'noticia', 'resena', 'cvEntry', 'localeString', 'localeText'].includes(item.getId() as string),
      ),
    ])
