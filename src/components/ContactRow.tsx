const ICONS: Record<string, React.ReactNode> = {
  mail: (
    <>
      <path d="M4 6h16v12H4z" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M8 19.5 4.5 21l1-3.7a8 8 0 1 1 2.5 2.2Z" />
      <path d="M9 9.5c.4 2.5 2 4.1 4.5 4.5" />
    </>
  ),
  catalogo: (
    <>
      <path d="M6 4h9l3 3v13H6z" />
      <path d="M14 4v4h4" />
      <path d="M8.5 13h7" />
      <path d="M8.5 16h5" />
    </>
  ),
  instagram: (
    <>
      <rect x="5" y="5" width="14" height="14" rx="4" />
      <circle cx="12" cy="12" r="3.2" />
      <path d="M16.8 7.2h.01" />
    </>
  ),
}

export default function ContactRow({
  href,
  label,
  icon,
  external,
}: {
  href: string
  label: string
  icon: keyof typeof ICONS
  external?: boolean
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className="group flex items-center justify-between gap-4 py-[17px] border-t border-line/70 hover:text-accent transition-colors"
    >
      <span className="flex items-center gap-3 text-[13px] font-semibold uppercase tracking-wide text-foreground/68 group-hover:text-accent transition-colors">
        <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] shrink-0 stroke-foreground/40 group-hover:stroke-accent transition-colors" strokeWidth="1.7" fill="none">
          {ICONS[icon]}
        </svg>
        {label}
      </span>
      <span className="text-accent text-[15px]">↗</span>
    </a>
  )
}
