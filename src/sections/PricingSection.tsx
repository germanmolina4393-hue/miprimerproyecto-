import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Check, ShieldCheck } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const PLANS = [
  {
    name: 'Pack 3 Libros',
    price: '11.900',
    description: 'Elegí tres aventuras del catálogo',
    features: ['3 libros completos en PDF', 'Formato A4 para imprimir', 'Elegís cualquier combinación', 'Ahorrás $2.800'],
    link: 'https://mpago.la/242QJqb',
    highlight: false,
    note: 'Después del pago, coordinamos por correo los tres títulos elegidos.',
  },
  {
    name: 'Colección Completa',
    price: '24.900',
    description: 'Los siete libros de Mundo de Colores',
    features: ['7 libros completos en PDF', '196 páginas interiores en total', 'Formato A4 para imprimir', 'Ahorrás $9.400'],
    link: 'https://mpago.la/1xJAgnk',
    highlight: true,
    note: 'Recibís los siete libros después de verificar el pago.',
  },
]

export default function PricingSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll('.pricing-card')
    if (!cards?.length) return
    gsap.fromTo(cards, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, stagger: 0.12, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: containerRef.current, start: 'top 85%', toggleActions: 'play none none none' },
    })
  }, [])

  const handleBuy = (plan: typeof PLANS[number]) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        content_name: plan.name,
        value: Number(plan.price.replace('.', '')),
        currency: 'ARS',
      })
    }
  }

  return (
    <section id="comprar" className="py-24 px-6 bg-charcoal">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-parchment mb-4">Elegí la opción que más te <span className="living-gradient">conviene</span></h2>
          <p className="text-parchment/50 text-lg">También podés comprar cada libro por separado a $4.900.</p>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PLANS.map(plan => (
            <article key={plan.name} className={`pricing-card relative rounded-3xl p-7 flex flex-col ${plan.highlight ? 'bg-gold text-charcoal shadow-2xl' : 'bg-white/5 text-parchment border border-white/10'}`}>
              {plan.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-coral text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">Mejor precio por libro</span>}
              <p className={`text-sm font-semibold mb-1 ${plan.highlight ? 'text-charcoal/60' : 'text-parchment/45'}`}>{plan.name}</p>
              <p className={`font-serif text-4xl font-bold mb-1 ${plan.highlight ? 'text-charcoal' : 'text-parchment'}`}>${plan.price}<span className={`text-sm font-normal ml-1 ${plan.highlight ? 'text-charcoal/50' : 'text-parchment/40'}`}>ARS</span></p>
              <p className={`text-sm mb-6 ${plan.highlight ? 'text-charcoal/60' : 'text-parchment/45'}`}>{plan.description}</p>
              <ul className="space-y-3 mb-6 flex-1">
                {plan.features.map(feature => <li key={feature} className={`flex items-start gap-2 text-sm ${plan.highlight ? 'text-charcoal/80' : 'text-parchment/65'}`}><Check size={17} className="mt-0.5 shrink-0 text-sage" /> {feature}</li>)}
              </ul>
              <p className={`mb-5 text-xs leading-relaxed ${plan.highlight ? 'text-charcoal/55' : 'text-parchment/40'}`}>{plan.note}</p>
              <a href={plan.link} target="_blank" rel="noopener noreferrer" onClick={() => handleBuy(plan)} className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-full font-semibold text-sm transition-all duration-300 ${plan.highlight ? 'bg-charcoal text-parchment hover:bg-charcoal/80' : 'bg-parchment/10 text-parchment hover:bg-gold hover:text-charcoal'}`}>
                Comprar con Mercado Pago <ArrowRight size={15} />
              </a>
            </article>
          ))}
        </div>

        <p className="mt-8 flex items-center justify-center gap-2 text-center text-sm text-parchment/40"><ShieldCheck size={17} /> Pago seguro con Mercado Pago · Entrega por correo después de verificar el pago</p>
      </div>
    </section>
  )
}
