import { useEffect } from 'react'
import { X, Printer, ArrowRight } from 'lucide-react'

interface Props {
  title: string
  image: string
  price: string
  paymentLink: string
  onClose: () => void
}

export default function PreviewModal({ title, image, price, paymentLink, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const handleBuy = () => {
    if ((window as any).fbq) {
      ;(window as any).fbq('track', 'InitiateCheckout', {
        content_name: title,
        value: parseInt(price.replace('.', '')),
        currency: 'ARS',
      })
    }
    window.open(paymentLink, '_blank', 'noopener')
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-parchment rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-charcoal/10 hover:bg-charcoal/20 rounded-full flex items-center justify-center transition-colors"
        >
          <X size={18} />
        </button>

        {/* Preview image con marca de agua */}
        <div className="relative overflow-hidden h-72 md:h-80 bg-white">
          <img src={image} alt={title} className="w-full h-full object-cover" />

          {/* Marca de agua */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="rotate-[-30deg] text-charcoal/10 font-serif text-5xl font-bold select-none whitespace-nowrap">
              MUNDO DE COLORES
            </div>
          </div>

          {/* Badge PDF */}
          <span className="absolute top-4 left-4 flex items-center gap-1.5 bg-coral text-white text-sm font-semibold px-3 py-1.5 rounded-full">
            <Printer size={14} /> Imagen referencial
          </span>
        </div>

        {/* Info */}
        <div className="p-6">
          <h2 className="font-serif text-2xl font-bold text-charcoal mb-2">{title}</h2>
          <div className="bg-gold/10 border border-gold/20 rounded-xl p-3 mb-4 text-sm text-charcoal/70 leading-relaxed">
            📄 <strong>¿Qué vas a recibir?</strong> Un PDF en blanco y negro con el diseño de <em>{title}</em>, listo para imprimir en hoja A4 y colorear con lápices, fibras o acuarelas. La imagen de arriba es una referencia del tema.
          </div>

          <ul className="flex flex-wrap gap-2 mb-6">
            {['PDF A4', 'Alta resolución', 'Descarga instantánea', 'Para imprimir'].map(f => (
              <li key={f} className="text-xs bg-gold/10 text-gold font-medium px-3 py-1 rounded-full">
                ✓ {f}
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-charcoal/40">Precio</p>
              <p className="font-serif text-3xl font-bold text-charcoal">
                ${price} <span className="text-base font-normal text-charcoal/40">ARS</span>
              </p>
            </div>
            <button
              onClick={handleBuy}
              className="flex items-center gap-2 bg-charcoal text-parchment px-7 py-3.5 rounded-full font-semibold hover:bg-gold transition-colors duration-300"
            >
              Comprar ahora <ArrowRight size={16} />
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-charcoal/30">
            🔒 Pago seguro con MercadoPago · PDF en tu mail al instante
          </p>
        </div>
      </div>
    </div>
  )
}
