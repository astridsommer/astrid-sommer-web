// Traduce las opciones cerradas del documento `homePage` en Sanity a clases
// Tailwind ya definidas. Nunca se acepta CSS libre: si el valor guardado no
// está en el mapa, se usa el valor "aprobado" como respaldo seguro.

const HERO_NOMBRE_TAMANO: Record<string, string> = {
  pequeno: 'text-[clamp(19px,2vw,30px)]',
  aprobado: 'text-[clamp(24px,2.6vw,40px)]',
  grande: 'text-[clamp(30px,3.4vw,54px)]',
}

const SECCION_TITULO_TAMANO: Record<string, string> = {
  pequeno: 'text-[clamp(19px,2vw,30px)]',
  aprobado: 'text-[clamp(24px,2.6vw,42px)]',
  mediano: 'text-[clamp(28px,3vw,50px)]',
}

const DESCRIPTOR_TAMANO: Record<string, string> = {
  pequeno: 'text-[10px]',
  aprobado: 'text-[11px]',
}

const PESO: Record<string, string> = {
  thin: 'font-extralight',
  light: 'font-light',
  regular: 'font-normal',
}

const GRIS_TEXTO: Record<string, string> = {
  claro: 'text-foreground/38',
  aprobado: 'text-foreground/50',
  medio: 'text-foreground/60',
}

const GRIS_DESCRIPTOR: Record<string, string> = {
  claro: 'text-foreground/38',
  medio: 'text-foreground/50',
}

function pick<T extends Record<string, string>>(map: T, value: string | undefined | null, fallback: keyof T & string) {
  return map[value ?? ''] ?? map[fallback]
}

export function heroNombreClases(v?: { heroNombreTamano?: string; heroNombrePeso?: string; heroNombreColor?: string } | null) {
  return [
    pick(HERO_NOMBRE_TAMANO, v?.heroNombreTamano, 'aprobado'),
    pick(PESO, v?.heroNombrePeso, 'thin'),
    pick(GRIS_TEXTO, v?.heroNombreColor, 'aprobado'),
  ].join(' ')
}

export function heroDescriptorClases(v?: { heroDescriptorTamano?: string; heroDescriptorColor?: string; heroDescriptorMayusculas?: boolean } | null) {
  return [
    pick(DESCRIPTOR_TAMANO, v?.heroDescriptorTamano, 'aprobado'),
    pick(GRIS_DESCRIPTOR, v?.heroDescriptorColor, 'medio'),
    v?.heroDescriptorMayusculas === false ? '' : 'uppercase',
  ]
    .filter(Boolean)
    .join(' ')
}

// Título principal (h1) de todas las páginas interiores (todo excepto Home).
// Mismo sistema en todas: alineado a la izquierda, chico, gris sutil, peso
// ligero. `PAGE_TITLE_WRAP` fija el mismo espacio de aire debajo del título
// en cada página, para que la altura visual sea idéntica en todo el sitio.
export const PAGE_TITLE = 'font-sans font-extralight text-left text-[clamp(20px,2vw,30px)] leading-[1.2] text-foreground/40'
export const PAGE_TITLE_WRAP = 'mb-14 md:mb-16'

export function seccionTituloClases(v?: { seccionTituloTamano?: string; seccionTituloPeso?: string; seccionTituloColor?: string } | null) {
  return [
    'font-sans leading-[1.12]',
    pick(SECCION_TITULO_TAMANO, v?.seccionTituloTamano, 'aprobado'),
    pick(PESO, v?.seccionTituloPeso, 'thin'),
    pick(GRIS_TEXTO, v?.seccionTituloColor, 'claro'),
  ].join(' ')
}
