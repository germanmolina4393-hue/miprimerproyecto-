import { Printer } from 'lucide-react'
import TiltCard from './TiltCard'

interface Props {
  title: string
  image: string
  price: string
  paymentLink: string
}

export default function FeaturedCard({ title, image, price, paymentLink }: Props) {
  const handleBuy = () => {
    // Track Meta Pixel purchase intent
    if (typeof window !== 'undefined' && (window as any).fbq) {
      ;(window as any).fbq('track', 'InitiateCheckout', { content_name: title, value: price, currency: 'ARS' })
    }
    window.open(paymentLink, '_blank', 'noopener')
  }

  return (
    <TiltCard className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-shadow duration-500 card-overlay cursor-pointer">
      <div className="relative overflow-hidden h-52 card-image-zoom">
        <img src={image} alt={title} loading="lazy" className="w-full h-full object-cover" />
        <span className="absolute top-3 left-3 flex items-center gap-1 bg-coral text-white text-xs font-semibold px-3 py-1 rounded-full">
          <Printer size={12} /> PDF
        </span>
        <span className="absolute bottom-3 right-3 bg-charcoal/80 text-parchment text-sm font-bold px-3 py-1 rounded-full">
          ${price} ARS
        </span>
      </div>
      <div className="p-4 flex items-center justify-between">
        <h3 className="font-serif text-base font-semibold text-charcoal">{title}</h3>
        <button
          onClick={handleBuy}
          className="flex items-center gap-1 bg-charcoal text-parchment text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-gold transition-colors duration-300"
        >
          Comprar
        </button>
      </div>
    </TiltCard>
  )
}
