import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BookOpen, Check, ShieldCheck } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const SAMPLES = ['/assets/products/dinosaurios-muestra-01.jpg', '/assets/products/dinosaurios-muestra-02.jpg', '/assets/products/dinosaurios-muestra-03.jpg']

export default function FeaturedSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll('.product-reveal')
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
            Nuestra primera <span className="living-gradient">joyita</span>
          </h2>
          <p className="text-charcoal/50 text-lg max-w-xl mx-auto">
            Mirá páginas reales del producto que vas a recibir.
          </p>
        </div>

        <div ref={containerRef} className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] items-start">
          <div className="product-reveal rounded-3xl bg-white p-5 shadow-xl">
            <img src="/assets/products/dinosaurios-cover.jpg" alt="Portada de Dinosaurios para Colorear" className="w-full rounded-2xl" />
          </div>
          <div className="product-reveal pt-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-sage/15 px-4 py-2 text-sm font-semibold text-sage"><ShieldCheck size={16} /> Contenido original y seguro</span>
            <h3 className="mt-5 font-serif text-4xl font-bold text-charcoal">Dinosaurios para Colorear</h3>
            <p className="mt-2 text-sm font-semibold tracking-wide text-gold">COLECCIÓN FUNDADORA · NGM-MDC-001</p>
            <p className="mt-5 text-lg leading-relaxed text-charcoal/60">Una aventura educativa protagonizada por Dino y Trici, creada para que los chicos coloreen, aprendan y resuelvan pequeños desafíos.</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 text-charcoal/75">
              {['28 páginas interiores', 'Formato PDF A4', 'Edad sugerida: 4 a 8 años', 'Dinosaurios y datos curiosos', 'Desafíos sin respuestas marcadas', 'Diploma final incluido'].map(item => <li key={item} className="flex items-center gap-2"><Check size={17} className="text-sage" /> {item}</li>)}
            </ul>
            <div id="comprar" className="mt-8 rounded-2xl border border-gold/25 bg-gold/5 p-6">
              <div className="flex items-center gap-3"><BookOpen className="text-gold" /><p className="font-semibold text-charcoal">Lanzamiento en preparación</p></div>
              <p className="mt-2 text-sm text-charcoal/55">Estamos configurando el precio y la entrega automática. El botón de compra se habilitará después de comprobar todo el circuito.</p>
            </div>
          </div>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {SAMPLES.map((image, index) => <figure key={image} className="product-reveal overflow-hidden rounded-2xl bg-white p-3 shadow-sm"><img src={image} alt={`Página real de muestra ${index + 1}`} className="h-full w-full rounded-xl object-cover" /></figure>)}
        </div>
      </div>
    </section>
  )
}
