import type { Metadata } from 'next'
import { locales, type Locale } from '@/i18n/dictionary'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  title: 'Astrid Sommer',
  description: 'Astrid Sommer — artista visual. Pintura, fotografía, escultura y obra sobre papel.',
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params as { locale: Locale }
  return (
    <>
      <Nav locale={locale} />
      <main>{children}</main>
      <Footer locale={locale} />
    </>
  )
}
