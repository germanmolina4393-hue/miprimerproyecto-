import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MousePointerClick, Printer, Search } from 'lucide-react'
import StepCard from '../components/StepCard'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  {
    icon: <Search size={28} className="text-gold" />,
    title: 'Elegí tu diseño',
    description: 'Navegá entre más de 100 diseños únicos organizados por categorías. Hay algo para todos.',
  },
  {
    icon: <MousePointerClick size={28} className="text-coral" />,
    title: 'Comprá con seguridad',
    description: 'Pagá de forma segura con MercadoPago, tarjeta o transferencia. Proceso en segundos.',
  },
  {
    icon: <Printer size={28} className="text-sage" />,
    title: 'Imprimí y disfrutá',
    description: 'Recibís el PDF al instante en tu mail. Imprimí en casa o en cualquier imprenta.',
  },
]

export default function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll('.step-card')
    if (!cards?.length) return

    gsap.fromTo(
      cards,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, stagger: 0.15, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: containerRef.current, start: 'top 85%', toggleActions: 'play none none none' },
      }
    )
  }, [])

  return (
    <section id="como-funciona" className="py-24 px-6 bg-charcoal">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-parchment mb-4">
            ¿Cómo <span className="living-gradient">funciona</span>?
          </h2>
          <p className="text-parchment/40 text-lg">Tres pasos simples para tener tu diseño.</p>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-px bg-gold/20" />

          {STEPS.map((step, i) => (
            <div key={step.title} className="step-card">
              <StepCard number={i + 1} {...step} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
