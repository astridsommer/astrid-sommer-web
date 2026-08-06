import { NextRequest, NextResponse } from 'next/server'
import { locales, defaultLocale } from '@/i18n/dictionary'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  )

  if (pathnameIsMissingLocale && !pathname.startsWith('/studio') && !pathname.startsWith('/api')) {
    return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url))
  }
}

export const config = {
  matcher: ['/((?!_next|studio|api|favicon.ico|.*\\..*).*)'],
}
