import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const PLANS = [
  {
    name: 'Diseño individual',
    price: '500',
    description: '1 diseño a tu elección',
    features: ['1 archivo PDF', 'Alta resolución para imprimir', 'Descarga instantánea'],
    link: 'https://mpago.la/18X3ruY',
    highlight: false,
  },
  {
    name: 'Pack 5 diseños',
    price: '1.800',
    description: 'Elegís 5 diseños',
    features: ['5 archivos PDF', 'Alta resolución para imprimir', 'Descarga instantánea', 'Ahorrás 28%'],
    link: 'https://mpago.la/267Kc7C',
    highlight: false,
  },
  {
    name: 'Pack 10 diseños',
    price: '2.900',
    description: 'Elegís 10 diseños',
    features: ['10 archivos PDF', 'Alta resolución para imprimir', 'Descarga instantánea', 'Ahorrás 42%'],
    link: 'https://mpago.la/1My8GC8',
    highlight: true,
  },
  {
    name: 'Pack Completo',
    price: '4.500',
    description: 'Todos los diseños disponibles',
    features: ['Todos los PDF', 'Alta resolución para imprimir', 'Descarga instantánea', 'Acceso a nuevos diseños', 'Ahorro máximo'],
    link: 'https://mpago.la/14UdmvK',
    highlight: false,
  },
]

export default function PricingSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll('.pricing-card')
    if (!cards?.length) return

    gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, stagger: 0.12, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: containerRef.current, start: 'top 85%', toggleActions: 'play none none none' },
      }
    )
  }, [])

  const handleBuy = (plan: typeof PLANS[0]) => {
    if (typeof window !== 'undefined' && (window as any).fbq) {
      ;(window as any).fbq('track', 'InitiateCheckout', {
        content_name: plan.name,
        value: parseInt(plan.price.replace('.', '')),
        currency: 'ARS',
      })
    }
    window.open(plan.link, '_blank', 'noopener')
  }

  return (
    <section id="comprar" className="py-24 px-6 bg-charcoal">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-parchment mb-4">
            Elegí tu <span className="living-gradient">pack</span>
          </h2>
          <p className="text-parchment/40 text-lg">Pago seguro con MercadoPago. Descarga instantánea.</p>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLANS.map(plan => (
            <div
              key={plan.name}
              className={`pricing-card relative rounded-2xl p-6 flex flex-col ${
                plan.highlight
                  ? 'bg-gold text-charcoal shadow-2xl scale-[1.03]'
                  : 'bg-white/5 text-parchment border border-white/10'
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-coral text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                  ⭐ Más popular
                </span>
              )}

              <p className={`text-sm font-semibold mb-1 ${plan.highlight ? 'text-charcoal/60' : 'text-parchment/40'}`}>
                {plan.name}
              </p>
              <p className={`font-serif text-4xl font-bold mb-1 ${plan.highlight ? 'text-charcoal' : 'text-parchment'}`}>
                ${plan.price}
                <span className={`text-sm font-normal ml-1 ${plan.highlight ? 'text-charcoal/50' : 'text-parchment/40'}`}>ARS</span>
              </p>
              <p className={`text-sm mb-5 ${plan.highlight ? 'text-charcoal/60' : 'text-parchment/40'}`}>
                {plan.description}
              </p>

              <ul className="space-y-2 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlight ? 'text-charcoal/80' : 'text-parchment/60'}`}>
                    <span className="text-sage">✓</span> {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleBuy(plan)}
                className={`flex items-center justify-center gap-2 w-full py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
                  plan.highlight
                    ? 'bg-charcoal text-parchment hover:bg-charcoal/80'
                    : 'bg-parchment/10 text-parchment hover:bg-gold hover:text-charcoal'
                }`}
              >
                Comprar ahora <ArrowRight size={15} />
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-parchment/30 text-sm mt-8">
          🔒 Pago seguro con MercadoPago &nbsp;·&nbsp; 📩 Recibís el PDF en tu mail al instante
        </p>
      </div>
    </section>
  )
}
