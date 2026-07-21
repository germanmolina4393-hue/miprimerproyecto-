import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CategoryCard from '../components/CategoryCard'
import { BOOKS } from '../books'

gsap.registerPlugin(ScrollTrigger)

export default function CategoriesSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll('.category-card')
    if (!cards?.length) return
    gsap.fromTo(cards, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: containerRef.current, start: 'top 85%', toggleActions: 'play none none none' },
    })
  }, [])

  return (
    <section id="categorias" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-charcoal mb-4">
            Explorá nuestros <span className="living-gradient">libros</span>
          </h2>
          <p className="text-charcoal/50 text-lg max-w-xl mx-auto">
            Siete libros originales, completos y listos para descubrir.
          </p>
        </div>
        <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {BOOKS.map(book => (
            <div key={book.code} className="category-card">
              <CategoryCard {...book} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
