import TiltCard from './TiltCard'

interface Props {
  title: string
  badge: string
  image: string
  count: number
}

export default function CategoryCard({ title, badge, image, count }: Props) {
  return (
    <TiltCard className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-shadow duration-500 card-overlay cursor-pointer">
      <div className="relative overflow-hidden h-52 card-image-zoom">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <span className="absolute top-3 left-3 bg-gold text-white text-xs font-semibold px-3 py-1 rounded-full">
          {badge}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-serif text-lg font-semibold text-charcoal">{title}</h3>
        <p className="text-sm text-charcoal/50 mt-1">{count} diseños disponibles</p>
      </div>
    </TiltCard>
  )
}
