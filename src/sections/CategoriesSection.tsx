import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CategoryCard from '../components/CategoryCard'

gsap.registerPlugin(ScrollTrigger)

export const CATEGORIES = [
  { title: 'Animales', badge: 'Popular', image: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=600&h=400&fit=crop', count: 24, description: 'Leones, elefantes, mariposas y más. Perfectos para niños y adultos.' },
  { title: 'Mandalas', badge: 'Relajación', image: 'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=600&h=400&fit=crop', count: 18, description: 'Diseños circulares simétricos. Ideales para relajarse y concentrarse.' },
  { title: 'Naturaleza', badge: 'Nuevo', image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&h=400&fit=crop', count: 15, description: 'Árboles, flores silvestres, paisajes y escenas del mundo natural.' },
  { title: 'Princesas', badge: 'Infantil', image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&h=400&fit=crop', count: 20, description: 'Castillos, coronas y personajes de cuento para las más pequeñas.' },
  { title: 'Superhéroes', badge: 'Infantil', image: 'https://images.unsplash.com/photo-1569003339405-ea396a5a8374?w=600&h=400&fit=crop', count: 16, description: 'Personajes de acción y aventura para los más chicos de la casa.' },
  { title: 'Flores', badge: 'Adultos', image: 'https://images.unsplash.com/photo-1490750967868-88df5691cc47?w=600&h=400&fit=crop', count: 22, description: 'Rosas, girasoles, tulipanes y composiciones florales detalladas.' },
  { title: 'Navidad', badge: 'Temporada', image: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=600&h=400&fit=crop', count: 12, description: 'Papá Noel, renos, árboles y motivos navideños para la familia.' },
  { title: 'Dinosaurios', badge: 'Infantil', image: 'https://images.unsplash.com/photo-1615243029542-4fcced64c70e?w=600&h=400&fit=crop', count: 14, description: 'T-Rex, braquiosaurio y todas las especies favoritas de los chicos.' },
  { title: 'Arte abstracto', badge: 'Adultos', image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&h=400&fit=crop', count: 10, description: 'Formas geométricas y patrones complejos para una experiencia meditativa.' },
  { title: 'Vehículos', badge: 'Infantil', image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=400&fit=crop', count: 11, description: 'Autos, aviones, trenes y barcos. Favoritos de los más pequeños.' },
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
