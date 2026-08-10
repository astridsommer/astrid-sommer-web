'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function HeroCarousel({ images }: { images: { url: string; alt: string }[] }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), 5200)
    return () => clearInterval(id)
  }, [images.length])

  if (images.length === 0) return null

  return (
    <div className="relative h-full w-full grid">
      <div className="relative h-full w-full min-h-0">
        {images.map((img, i) => (
          <div
            key={img.url}
            className="absolute inset-0 transition-opacity duration-700 ease-out"
            style={{ opacity: i === index ? 1 : 0 }}
          >
            <Image
              src={img.url}
              alt={img.alt}
              fill
              sizes="(min-width: 768px) 65vw, 100vw"
              className="object-contain object-bottom md:object-center"
              priority={i === 0}
            />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-2.5">
          {images.map((img, i) => (
            <button
              key={img.url}
              aria-label={`Ver obra ${i + 1}`}
              onClick={() => setIndex(i)}
              className="h-[3px] w-7 bg-transparent"
            >
              <span
                className="block h-full w-full transition-colors duration-300"
                style={{ background: i === index ? 'var(--foreground)' : 'rgba(43,42,39,.24)' }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
