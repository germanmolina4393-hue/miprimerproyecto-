import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MailCheck, MousePointerClick, Search } from 'lucide-react'
import StepCard from '../components/StepCard'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  { icon: <Search size={28} className="text-gold" />, title: 'Elegí tu aventura', description: 'Explorá las siete portadas y elegí un libro, un pack de tres o la colección completa.' },
  { icon: <MousePointerClick size={28} className="text-coral" />, title: 'Pagá con seguridad', description: 'Completá el pago mediante Mercado Pago desde el botón correspondiente a tu elección.' },
  { icon: <MailCheck size={28} className="text-sage" />, title: 'Recibí tus libros', description: 'Verificamos la compra y enviamos los PDF A4 al correo utilizado en el pago.' },
]

export default function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll('.step-card')
    if (!cards?.length) return
    gsap.fromTo(cards, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, stagger: 0.15, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: containerRef.current, start: 'top 85%', toggleActions: 'play none none none' },
    })
  }, [])

  return (
    <section id="como-funciona" className="py-24 px-6 bg-charcoal">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-parchment mb-4">¿Cómo <span className="living-gradient">funciona</span>?</h2>
          <p className="text-parchment/40 text-lg">Una experiencia clara, segura y pensada para las familias.</p>
        </div>
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-px bg-gold/20" />
          {STEPS.map((step, index) => <div key={step.title} className="step-card"><StepCard number={index + 1} {...step} /></div>)}
        </div>
      </div>
    </section>
  )
}
