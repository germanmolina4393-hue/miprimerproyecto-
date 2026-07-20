import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BookOpen, Check, ShieldCheck, Sparkles } from 'lucide-react'
import { BOOKS } from './CategoriesSection'

gsap.registerPlugin(ScrollTrigger)

export default function FeaturedSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const items = containerRef.current?.querySelectorAll('.product-reveal')
    if (!items?.length) return

    gsap.fromTo(items, { opacity: 0, y: 35 }, {
      opacity: 1,
      y: 0,
      stagger: 0.07,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: containerRef.current, start: 'top 85%', toggleActions: 'play none none none' },
    })
  }, [])

  return (
    <section id="destacados" className="py-24 px-6 bg-white/45">
      <div ref={containerRef} className="max-w-7xl mx-auto">
        <div className="mx-auto max-w-3xl text-center product-reveal">
          <span className="inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-2 text-sm font-semibold text-gold">
            <Sparkles size={16} /> Colección Mundo de Colores
          </span>
          <h2 className="mt-5 font-serif text-4xl md:text-5xl font-bold text-charcoal">
            Siete mundos, una misma <span className="living-gradient">calidad</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-charcoal/55">
            Cada libro fue creado, revisado y terminado página por página bajo la filosofía de NGM Studio.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
          {BOOKS.map(book => (
            <figure key={book.code} className="product-reveal group rounded-2xl bg-white p-2 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <img src={book.image} alt={`Portada de ${book.title}`} className="aspect-[1/1.414] w-full rounded-xl object-cover" loading="lazy" />
              <figcaption className="px-1 pb-2 pt-3 text-center">
                <span className="text-[11px] font-bold tracking-wide text-gold">{book.code}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-14 grid gap-8 rounded-3xl border border-gold/20 bg-parchment p-7 product-reveal lg:grid-cols-[1fr_1.15fr] lg:p-10">
          <div>
            <div className="flex items-center gap-3 text-charcoal">
              <BookOpen className="text-gold" />
              <h3 className="font-serif text-3xl font-bold">Una colección lista para crecer</h3>
            </div>
            <p className="mt-4 leading-relaxed text-charcoal/60">
              Los siete títulos ya forman parte del catálogo oficial. Halloween y futuras aventuras se sumarán como nuevos lanzamientos, sin retrasar esta primera colección.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 text-charcoal/75">
            {['28 páginas interiores por libro', 'Formato PDF A4 para imprimir', 'Ilustraciones y personajes originales', 'Textos y actividades revisados', 'Contenido infantil seguro', 'Calidad editorial NGM Studio'].map(item => (
              <li key={item} className="flex items-start gap-2">
                <Check size={18} className="mt-0.5 shrink-0 text-sage" /> {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-sage product-reveal">
          <ShieldCheck size={18} /> Archivos finales protegidos hasta completar la compra
        </div>
      </div>
    </section>
  )
}
