import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CategoryCard from '../components/CategoryCard'

gsap.registerPlugin(ScrollTrigger)

const CATEGORIES = [
  { title: 'Dinosaurios', badge: 'Disponible', image: '/assets/products/dinosaurios-cover.jpg', count: 1, description: 'Nuestra Edición Fundadora: 28 páginas de aventuras, datos curiosos, desafíos y diploma final.', available: true },
  { title: 'Animales de la Granja', badge: 'Próximamente', image: '/assets/categories/granja.jpg', count: 0, description: 'Animales amigables y actividades educativas creadas desde cero por NGM Studio.', available: false },
  { title: 'Unicornios', badge: 'Próximamente', image: '/assets/categories/unicornios.jpg', count: 0, description: 'Un mundo mágico con personajes completamente originales.', available: false },
  { title: 'Vehículos', badge: 'Próximamente', image: '/assets/categories/vehiculos.jpg', count: 0, description: 'Autos, camiones, trenes y aventuras para pequeños fanáticos de los motores.', available: false },
  { title: 'Mundo Marino', badge: 'Próximamente', image: '/assets/categories/marino.jpg', count: 0, description: 'Animales del océano, curiosidades y actividades para aprender coloreando.', available: false },
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
            Explorá nuestras <span className="living-gradient">categorías</span>
          </h2>
          <p className="text-charcoal/50 text-lg max-w-xl mx-auto">
            Hacé clic en cualquier categoría para ver los diseños disponibles.
          </p>
        </div>
        <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {CATEGORIES.map(cat => (
            <div key={cat.title} className="category-card">
              <CategoryCard {...cat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
