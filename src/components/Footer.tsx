import type { Locale } from '@/i18n/dictionary'

export default function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="border-t border-black/10 px-6 md:px-10 py-10 mt-24 text-xs tracking-widest uppercase flex flex-col md:flex-row justify-between gap-4">
      <span>&copy; {new Date().getFullYear()} Astrid Sommer</span>
      <div className="flex gap-6">
        <a href="https://www.instagram.com/mtallermx" target="_blank" rel="noreferrer">Instagram</a>
        <a href="http://www.facebook.com/astrid.sommer.568" target="_blank" rel="noreferrer">Facebook</a>
      </div>
    </footer>
  )
}
