import { useState } from 'react'
import { X, ArrowRight } from 'lucide-react'
import TiltCard from './TiltCard'

interface Props {
  title: string
  badge: string
  image: string
  count: number
  description: string
  available: boolean
}

function CategoryModal({ title, image, count, description, badge, available, onClose }: Props & { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-parchment rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-charcoal/10 hover:bg-charcoal/20 rounded-full flex items-center justify-center transition-colors"
        >
          <X size={18} />
        </button>

        <div className="relative h-56 overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
          <span className="absolute top-4 left-4 bg-gold text-white text-xs font-semibold px-3 py-1 rounded-full">{badge}</span>
          <p className="absolute bottom-4 left-4 text-white font-serif text-2xl font-bold">{title}</p>
        </div>

        <div className="p-6">
          <p className="text-charcoal/60 text-sm leading-relaxed mb-4">{description}</p>
          <p className="text-charcoal/40 text-xs mb-5">{available ? `📘 ${count} libro disponible` : '🛠️ En producción bajo la filosofía NGM Studio'}</p>
          {available ? (
            <a href="#destacados" onClick={onClose} className="flex items-center justify-center gap-2 bg-charcoal text-parchment px-6 py-3 rounded-full font-semibold text-sm hover:bg-gold transition-colors duration-300">
              Conocer el libro <ArrowRight size={15} />
            </a>
          ) : (
            <p className="text-center rounded-full bg-charcoal/5 px-6 py-3 text-sm font-semibold text-charcoal/50">Próximamente</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CategoryCard({ title, badge, image, count, description, available }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <TiltCard
        className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-shadow duration-500 card-overlay cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="relative overflow-hidden h-52 card-image-zoom">
          <img src={image} alt={title} loading="lazy" className="w-full h-full object-cover" />
          <span className="absolute top-3 left-3 bg-gold text-white text-xs font-semibold px-3 py-1 rounded-full">
            {badge}
          </span>
          <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-colors duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-charcoal text-xs font-semibold px-3 py-1.5 rounded-full">
              Ver categoría
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-serif text-lg font-semibold text-charcoal">{title}</h3>
          <p className="text-sm text-charcoal/50 mt-1">{available ? 'Libro PDF disponible' : 'En producción'}</p>
        </div>
      </TiltCard>

      {open && <CategoryModal title={title} badge={badge} image={image} count={count} description={description} available={available} onClose={() => setOpen(false)} />}
    </>
  )
}
