import { useState } from 'react'
import { Printer } from 'lucide-react'
import TiltCard from './TiltCard'
import PreviewModal from './PreviewModal'

interface Props {
  title: string
  image: string
  price: string
  paymentLink: string
}

export default function FeaturedCard({ title, image, price, paymentLink }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <TiltCard
        className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-shadow duration-500 card-overlay cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="relative overflow-hidden h-52 card-image-zoom">
          <img src={image} alt={title} loading="lazy" className="w-full h-full object-cover" />
          <span className="absolute top-3 left-3 flex items-center gap-1 bg-coral text-white text-xs font-semibold px-3 py-1 rounded-full">
            <Printer size={12} /> PDF
          </span>
          <span className="absolute bottom-3 right-3 bg-charcoal/80 text-parchment text-sm font-bold px-3 py-1 rounded-full">
            ${price} ARS
          </span>
          {/* Hover hint */}
          <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-colors duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-charcoal text-xs font-semibold px-3 py-1.5 rounded-full">
              Ver preview
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-serif text-base font-semibold text-charcoal">{title}</h3>
          <p className="text-xs text-charcoal/40 mt-0.5">Hacé clic para ver el diseño</p>
        </div>
      </TiltCard>

      {open && (
        <PreviewModal
          title={title}
          image={image}
          price={price}
          paymentLink={paymentLink}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
