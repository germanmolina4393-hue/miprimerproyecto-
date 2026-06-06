import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CategoryCard from '../components/CategoryCard'

gsap.registerPlugin(ScrollTrigger)

const CATEGORIES = [
  { title: 'Animales', badge: 'Popular', image: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=400&h=300&fit=crop', count: 24 },
  { title: 'Mandalas', badge: 'Relajación', image: 'https://images.unsplash.com/photo-1585503418537-88331351ad99?w=400&h=300&fit=crop', count: 18 },
  { title: 'Naturaleza', badge: 'Nuevo', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop', count: 15 },
  { title: 'Princesas', badge: 'Infantil', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=300&fit=crop', count: 20 },
  { title: 'Superhéroes', badge: 'Infantil', image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=300&fit=crop', count: 16 },
  { title: 'Flores', badge: 'Adultos', image: 'https://images.unsplash.com/photo-1490750967868-88df5691cc47?w=400&h=300&fit=crop', count: 22 },
  { title: 'Navidad', badge: 'Temporada', image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&h=300&fit=crop', count: 12 },
  { title: 'Dinosaurios', badge: 'Infantil', image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=300&fit=crop', count: 14 },
  { title: 'Arte abstracto', badge: 'Adultos', image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=300&fit=crop', count: 10 },
  { title: 'Vehículos', badge: 'Infantil', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', count: 11 },
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

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()) }
  }, [])

  return (
    <section id="categorias" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-charcoal mb-4">
            Explorá nuestras <span className="living-gradient">categorías</span>
          </h2>
          <p className="text-charcoal/50 text-lg max-w-xl mx-auto">
            Encontrá el diseño perfecto para cada momento y cada persona.
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
