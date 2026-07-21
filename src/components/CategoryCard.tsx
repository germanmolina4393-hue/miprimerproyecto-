import { useState } from 'react'
import { X, ArrowRight, ShieldCheck } from 'lucide-react'
import TiltCard from './TiltCard'

interface Props {
  title: string
  code: string
  badge: string
  image: string
  pages: number
  price: string
  paymentLink: string
  description: string
}

function trackCheckout(title: string, price: string) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      content_name: title,
      value: Number(price.replace('.', '')),
      currency: 'ARS',
    })
  }
}

function CategoryModal({ title, code, image, pages, price, paymentLink, description, badge, onClose }: Props & { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-sm" onClick={onClose}>
      <div className="relative bg-parchment rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-9 h-9 bg-charcoal/10 hover:bg-charcoal/20 rounded-full flex items-center justify-center transition-colors" aria-label="Cerrar">
          <X size={18} />
        </button>

        <div className="relative h-72 overflow-hidden bg-white">
          <img src={image} alt={`Portada de ${title}`} className="w-full h-full object-contain p-3" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
          <span className="absolute top-4 left-4 bg-gold text-white text-xs font-semibold px-3 py-1 rounded-full">{badge}</span>
          <p className="absolute bottom-4 left-4 text-white font-serif text-2xl font-bold">{title}</p>
        </div>

        <div className="p-6">
          <p className="text-charcoal/60 text-sm leading-relaxed mb-4">{description}</p>
          <div className="mb-5 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-gold/10 px-3 py-1.5 text-gold">{code}</span>
            <span className="rounded-full bg-sage/10 px-3 py-1.5 text-sage">PDF A4 · {pages} páginas</span>
          </div>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/45">Libro completo</p>
              <p className="font-serif text-3xl font-bold text-charcoal">${price} <span className="text-sm font-normal text-charcoal/45">ARS</span></p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-sage"><ShieldCheck size={15} /> Pago seguro</span>
          </div>
          <a href={paymentLink} target="_blank" rel="noopener noreferrer" onClick={() => trackCheckout(title, price)} className="flex items-center justify-center gap-2 bg-charcoal text-parchment px-6 py-3 rounded-full font-semibold text-sm hover:bg-gold transition-colors duration-300">
            Comprar con Mercado Pago <ArrowRight size={15} />
          </a>
          <p className="mt-3 text-center text-xs text-charcoal/45">Después de verificar el pago, recibirás el PDF por correo.</p>
        </div>
      </div>
    </div>
  )
}

export default function CategoryCard(props: Props) {
  const [open, setOpen] = useState(false)
  const { title, code, badge, image, pages, price } = props

  return (
    <>
      <TiltCard className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-shadow duration-500 card-overlay cursor-pointer" onClick={() => setOpen(true)}>
        <div className="relative overflow-hidden h-80 card-image-zoom bg-white">
          <img src={image} alt={`Portada de ${title}`} loading="lazy" className="w-full h-full object-contain p-3" />
          <span className="absolute top-3 left-3 bg-gold text-white text-xs font-semibold px-3 py-1 rounded-full">{badge}</span>
          <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-colors duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-charcoal text-xs font-semibold px-3 py-1.5 rounded-full">Ver y comprar</span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-serif text-lg font-semibold text-charcoal">{title}</h3>
          <p className="text-xs font-semibold tracking-wide text-gold mt-1">{code}</p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="text-sm text-charcoal/50">PDF A4 · {pages} páginas</p>
            <p className="text-sm font-bold text-charcoal">${price}</p>
          </div>
        </div>
      </TiltCard>
      {open && <CategoryModal {...props} onClose={() => setOpen(false)} />}
    </>
  )
}
