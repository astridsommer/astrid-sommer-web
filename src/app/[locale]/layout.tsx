import type { Metadata } from 'next'
import { locales, type Locale } from '@/i18n/dictionary'
import { client } from '@/sanity/lib/client'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  title: 'Astrid Sommer',
  description: 'Astrid Sommer — artista visual. Pintura, fotografía, escultura y obra sobre papel.',
}

async function getDropdownExposiciones() {
  try {
    return await client.fetch(
      `*[_type == "exposicion" && mostrarEnDropdown == true] | order(orden asc)[0...4]{ _id, titulo, "slug": slug.current }`,
    )
  } catch {
    return []
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params as { locale: Locale }
  const dropdownExposiciones = await getDropdownExposiciones()
  return (
    <>
      <Nav locale={locale} dropdownExposiciones={dropdownExposiciones} />
      <main>{children}</main>
      <Footer locale={locale} />
    </>
  )
}
