import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MousePointerClick, Printer, Search } from 'lucide-react'
import StepCard from '../components/StepCard'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  {
    icon: <Search size={28} className="text-gold" />,
    title: 'Elegí tu aventura',
    description: 'Explorá las siete portadas, conocé cada temática y elegí el libro ideal.',
  },
  {
    icon: <MousePointerClick size={28} className="text-coral" />,
    title: 'Comprá con seguridad',
    description: 'El pago se realizará de forma segura con Mercado Pago cuando habilitemos el lanzamiento.',
  },
  {
    icon: <Printer size={28} className="text-sage" />,
    title: 'Imprimí y disfrutá',
    description: 'El libro está preparado en PDF A4 para imprimir en casa o en una imprenta.',
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
          <p className="text-parchment/40 text-lg">Una experiencia clara, segura y pensada para las familias.</p>
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
