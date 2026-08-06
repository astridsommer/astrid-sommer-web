export const locales = ['es', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'es'

export const nav = {
  es: { home: 'Inicio', bio: 'Bio', portafolio: 'Portafolio', exposiciones: 'Exposiciones', resenas: 'Reseñas', noticias: 'Noticias', contacto: 'Contacto' },
  en: { home: 'Home', bio: 'Bio', portafolio: 'Portfolio', exposiciones: 'Exhibitions', resenas: 'Reviews', noticias: 'News', contacto: 'Contact' },
}

export const site = {
  es: {
    heroTitle: 'Astrid Sommer',
    heroSubtitle: 'Pintura, fotografía, escultura y obra sobre papel.',
    cta: 'Consultar disponibilidad',
    contactIntro: 'Para consultas sobre disponibilidad de obra, exposiciones, prensa o colaboraciones.',
  },
  en: {
    heroTitle: 'Astrid Sommer',
    heroSubtitle: 'Painting, photography, sculpture and works on paper.',
    cta: 'Inquire about availability',
    contactIntro: 'For inquiries about available work, exhibitions, press or collaborations.',
  },
}
