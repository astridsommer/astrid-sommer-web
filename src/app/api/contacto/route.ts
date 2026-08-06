import { NextRequest, NextResponse } from 'next/server'

// Envía las consultas del formulario directamente al correo habitual de Astrid.
// Requiere la variable de entorno RESEND_API_KEY y CONTACT_TO_EMAIL configuradas
// en Vercel antes de desplegar — no se activa nada hasta entonces.

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { nombre, email, perfil, mensaje, obraRelacionada, honeypot } = data

    // Protección simple contra bots
    if (honeypot) {
      return NextResponse.json({ ok: true })
    }

    if (!nombre || !email || !mensaje) {
      return NextResponse.json({ ok: false, error: 'Faltan campos requeridos' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    const toEmail = process.env.CONTACT_TO_EMAIL

    if (!apiKey || !toEmail) {
      console.warn('RESEND_API_KEY o CONTACT_TO_EMAIL no configurados todavía')
      return NextResponse.json({ ok: false, error: 'Formulario no configurado todavía' }, { status: 501 })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Sitio Astrid Sommer <onboarding@resend.dev>',
        to: toEmail,
        reply_to: email,
        subject: `Nueva consulta (${perfil || 'general'}) — ${nombre}`,
        text: `Nombre: ${nombre}\nEmail: ${email}\nPerfil: ${perfil}\nObra relacionada: ${obraRelacionada || '—'}\n\nMensaje:\n${mensaje}`,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Error enviando correo:', err)
      return NextResponse.json({ ok: false, error: 'No se pudo enviar el mensaje' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ ok: false, error: 'Error inesperado' }, { status: 500 })
  }
}
