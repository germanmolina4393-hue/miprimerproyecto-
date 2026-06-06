import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import FeaturedCard from '../components/FeaturedCard'

gsap.registerPlugin(ScrollTrigger)

// =====================================================================
// REEMPLAZÁ paymentLink de cada producto con tu link real de MercadoPago
// Ejemplo: https://mpago.la/XXXXXXXXX
// =====================================================================
const INDIVIDUAL_LINK = 'https://mpago.la/18X3ruY'
const PACK5_LINK = 'https://mpago.la/267Kc7C'

const FEATURED = [
  { title: 'León majestuoso', image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400&h=300&fit=crop', price: '500', paymentLink: INDIVIDUAL_LINK },
  { title: 'Mandala zen', image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=400&h=300&fit=crop', price: '500', paymentLink: INDIVIDUAL_LINK },
  { title: 'Bosque encantado', image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=300&fit=crop', price: '500', paymentLink: INDIVIDUAL_LINK },
  { title: 'Princesa del mar', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop', price: '500', paymentLink: INDIVIDUAL_LINK },
  { title: 'Dino aventurero', image: 'https://images.unsplash.com/photo-1606921231106-f1083329a65c?w=400&h=300&fit=crop', price: '500', paymentLink: INDIVIDUAL_LINK },
  { title: 'Jardín de flores', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop', price: '500', paymentLink: INDIVIDUAL_LINK },
  { title: 'Galaxia colorida', image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=300&fit=crop', price: '500', paymentLink: INDIVIDUAL_LINK },
  { title: 'Superhéroe X', image: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&h=300&fit=crop', price: '500', paymentLink: INDIVIDUAL_LINK },
  { title: 'Mariposa mágica', image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&h=300&fit=crop', price: '500', paymentLink: INDIVIDUAL_LINK },
  { title: 'Pack Navidad (5 diseños)', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=300&fit=crop', price: '1.800', paymentLink: PACK5_LINK },
]

export default function FeaturedSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll('.featured-card')
    if (!cards?.length) return

    gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: containerRef.current, start: 'top 85%', toggleActions: 'play none none none' },
      }
    )
  }, [])

  return (
    <section id="destacados" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-charcoal mb-4">
            Diseños <span className="living-gradient">destacados</span>
          </h2>
          <p className="text-charcoal/50 text-lg max-w-xl mx-auto">
            Los favoritos de nuestra comunidad. Listos para descargar ahora mismo.
          </p>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {FEATURED.map(item => (
            <div key={item.title} className="featured-card">
              <FeaturedCard {...item} />
            </div>
          ))}
        </div>

        {/* CTA general */}
        <div id="comprar" className="mt-16 text-center bg-gradient-to-r from-gold/10 via-coral/10 to-sage/10 rounded-3xl p-10">
          <h3 className="font-serif text-3xl font-bold text-charcoal mb-3">¿Querés todos los diseños?</h3>
          <p className="text-charcoal/50 mb-6">Accedé al pack completo y ahorrá más del 50%.</p>
          <a
            href="#comprar"
            className="inline-block bg-charcoal text-parchment px-10 py-4 rounded-full font-semibold text-base hover:bg-gold transition-colors duration-300"
          >
            Ver todos los packs y precios ↓
          </a>
        </div>
      </div>
    </section>
  )
}
