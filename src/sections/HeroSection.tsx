import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ArrowRight } from 'lucide-react'

interface Props {
  show: boolean
}

export default function HeroSection({ show }: Props) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const btnsRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!show) return
    const tl = gsap.timeline()
    tl.from(bgRef.current, { opacity: 0, duration: 1, ease: 'power2.out' })
      .from(titleRef.current, { opacity: 0, y: 40, duration: 0.7, ease: 'power2.out' }, '-=0.4')
      .from(descRef.current, { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .from(btnsRef.current, { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' }, '-=0.2')

    return () => { tl.kill() }
  }, [show])

  const trackClick = () => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'ViewContent')
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Warm parchment gradient background */}
      <div ref={bgRef} className="absolute inset-0 bg-gradient-to-br from-parchment via-gold-light/30 to-parchment" />

      {/* Decorative circles */}
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-coral/5 blur-3xl" />
      <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-sage/5 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-3xl" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 ref={titleRef} className="font-serif text-5xl md:text-7xl font-bold text-charcoal leading-tight mb-6">
          Aventuras para colorear,<br />
          <span className="living-gradient">aprender y crear</span>
        </h1>

        <p ref={descRef} className="text-charcoal/60 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
          Descubrí una colección de siete libros infantiles originales, con 28 páginas cada uno,
          actividades educativas y aventuras creadas por NGM Studio.
        </p>

        <div ref={btnsRef} className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#destacados"
            onClick={trackClick}
            className="inline-flex items-center gap-2 bg-charcoal text-parchment px-8 py-4 rounded-full font-semibold text-base hover:bg-gold transition-colors duration-300"
          >
            Ver la colección <ArrowRight size={18} />
          </a>
          <a
            href="#como-funciona"
            className="inline-flex items-center gap-2 border border-charcoal/20 text-charcoal px-8 py-4 rounded-full font-semibold text-base hover:border-gold hover:text-gold transition-colors duration-300"
          >
            Cómo funciona
          </a>
        </div>

        <p className="mt-8 text-sm text-charcoal/40">
          ✔ 7 libros &nbsp;✔ PDF A4 &nbsp;✔ Contenido original y seguro
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-px h-8 bg-charcoal/20" />
        <div className="w-1.5 h-1.5 rounded-full bg-gold" />
      </div>
    </section>
  )
}
