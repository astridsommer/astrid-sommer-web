'use client'
import { useState } from 'react'
import type { Locale } from '@/i18n/dictionary'

const PERFILES: Record<Locale, { value: string; label: string }[]> = {
  es: [
    { value: 'coleccionista', label: 'Coleccionista particular' },
    { value: 'galeria', label: 'Galería o curaduría' },
    { value: 'interiorismo', label: 'Interiorismo o arquitectura' },
    { value: 'prensa', label: 'Prensa' },
    { value: 'colaboracion', label: 'Colaboración' },
    { value: 'general', label: 'Consulta general' },
  ],
  en: [
    { value: 'coleccionista', label: 'Private collector' },
    { value: 'galeria', label: 'Gallery or curator' },
    { value: 'interiorismo', label: 'Interior design or architecture' },
    { value: 'prensa', label: 'Press' },
    { value: 'colaboracion', label: 'Collaboration' },
    { value: 'general', label: 'General inquiry' },
  ],
}

export default function ContactForm({ locale, obraRelacionada }: { locale: Locale; obraRelacionada?: string }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const form = new FormData(e.currentTarget)
    const payload = Object.fromEntries(form.entries())
    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, obraRelacionada }),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <p className="text-foreground/80">
        {locale === 'es' ? 'Gracias — tu mensaje fue enviado. Te responderemos pronto.' : 'Thank you — your message was sent. We will get back to you soon.'}
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      <input type="text" name="honeypot" className="hidden" tabIndex={-1} autoComplete="off" />
      <div>
        <label className="block text-xs tracking-widest uppercase text-muted mb-2">
          {locale === 'es' ? 'Nombre' : 'Name'}
        </label>
        <input name="nombre" required className="w-full border-b border-line py-2 bg-transparent focus:outline-none focus:border-accent" />
      </div>
      <div>
        <label className="block text-xs tracking-widest uppercase text-muted mb-2">Email</label>
        <input type="email" name="email" required className="w-full border-b border-line py-2 bg-transparent focus:outline-none focus:border-accent" />
      </div>
      <div>
        <label className="block text-xs tracking-widest uppercase text-muted mb-2">
          {locale === 'es' ? 'Perfil' : 'Profile'}
        </label>
        <select name="perfil" className="w-full border-b border-line py-2 bg-transparent focus:outline-none focus:border-accent">
          {PERFILES[locale].map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs tracking-widest uppercase text-muted mb-2">
          {locale === 'es' ? 'Mensaje' : 'Message'}
        </label>
        <textarea name="mensaje" required rows={5} className="w-full border-b border-line py-2 bg-transparent focus:outline-none focus:border-accent" />
      </div>
      <button type="submit" disabled={status === 'sending'} className="text-xs tracking-widest uppercase border border-accent px-8 py-3 hover:bg-accent hover:text-white hover:border-accent transition-colors disabled:opacity-40">
        {status === 'sending' ? (locale === 'es' ? 'Enviando…' : 'Sending…') : (locale === 'es' ? 'Enviar' : 'Send')}
      </button>
      {status === 'error' && (
        <p className="text-red-600 text-sm">
          {locale === 'es' ? 'No se pudo enviar. El correo del sitio aún no está configurado.' : 'Could not send. The site email is not configured yet.'}
        </p>
      )}
    </form>
  )
}
