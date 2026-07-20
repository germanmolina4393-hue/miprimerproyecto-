import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CategoryCard from '../components/CategoryCard'
import { BOOK_COVERS } from '../bookCovers'

gsap.registerPlugin(ScrollTrigger)

export const BOOKS = [
  { title: 'Dinosaurios para Colorear', code: 'NGM-MDC-001', badge: 'Disponible', image: BOOK_COVERS.dinosaurios, pages: 28, description: 'Dinosaurios, datos curiosos, pequeños desafíos y diploma de Pequeño Paleontólogo.' },
  { title: 'Animales de la Granja', code: 'NGM-MDC-002', badge: 'Disponible', image: BOOK_COVERS.granja, pages: 28, description: 'Una aventura entre animales amigables, escenas rurales y actividades educativas.' },
  { title: 'Mundo Marino', code: 'NGM-MDC-003', badge: 'Disponible', image: BOOK_COVERS['mundo-marino'], pages: 28, description: 'Un recorrido por el océano con criaturas marinas, curiosidades y juegos para aprender.' },
  { title: 'Vehículos para Colorear', code: 'NGM-MDC-004', badge: 'Disponible', image: BOOK_COVERS.vehiculos, pages: 28, description: 'Autos, camiones, máquinas y aventuras para pequeños fanáticos del movimiento.' },
  { title: 'Unicornios para Colorear', code: 'NGM-MDC-005', badge: 'Disponible', image: BOOK_COVERS.unicornios, pages: 28, description: 'Un mundo mágico de amistad, emociones y personajes originales de NGM Studio.' },
  { title: 'Navidad para Colorear', code: 'NGM-MDC-006', badge: 'Disponible', image: BOOK_COVERS.navidad, pages: 28, description: 'Escenas navideñas, juegos y momentos especiales para disfrutar en familia.' },
  { title: 'Las Estaciones del Año', code: 'NGM-MDC-007', badge: 'Disponible', image: BOOK_COVERS.estaciones, pages: 28, description: 'Primavera, verano, otoño e invierno reunidos en una aventura creativa y educativa.' },
]

export default function CategoriesSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll('.category-card')
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
