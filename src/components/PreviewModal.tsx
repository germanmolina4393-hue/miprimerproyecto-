import { useEffect, useState } from 'react'
import { X, ArrowRight, Printer } from 'lucide-react'

interface Props {
  title: string
  image: string
  price: string
  paymentLink: string
  onClose: () => void
}

export default function PreviewModal({ title, image, price, paymentLink, onClose }: Props) {
  const [colorMode, setColorMode] = useState<'color' | 'bw'>('bw')

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
    if (window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
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
        className="relative bg-white rounded-3xl overflow-hidden max-w-xl w-full shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center transition-colors"
        >
          <X size={18} />
        </button>

        {/* Toggle color / B&N */}
        <div className="absolute top-4 left-4 z-10 flex rounded-full overflow-hidden border border-white/30 text-xs font-semibold">
          <button
            onClick={() => setColorMode('bw')}
            className={`px-3 py-1.5 transition-colors ${colorMode === 'bw' ? 'bg-charcoal text-white' : 'bg-white/80 text-charcoal'}`}
          >
            🖊 Para colorear
          </button>
          <button
            onClick={() => setColorMode('color')}
            className={`px-3 py-1.5 transition-colors ${colorMode === 'color' ? 'bg-charcoal text-white' : 'bg-white/80 text-charcoal'}`}
          >
            🎨 Color
          </button>
        </div>

        {/* Imagen preview */}
        <div className="relative overflow-hidden bg-white" style={{ height: '300px' }}>
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-all duration-500"
            style={
              colorMode === 'bw'
                ? { filter: 'grayscale(100%) brightness(1.4) contrast(400%)', mixBlendMode: 'multiply' }
                : {}
            }
          />
          {/* Marca de agua solo en modo colorear */}
          {colorMode === 'bw' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="rotate-[-30deg] text-black/8 font-serif text-4xl font-bold select-none whitespace-nowrap">
                MUNDO DE COLORES
              </span>
            </div>
          )}
          {colorMode === 'bw' && (
            <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
              <Printer size={11} /> Así va a quedar para imprimir y colorear
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-5 bg-parchment">
          <h2 className="font-serif text-xl font-bold text-charcoal mb-3">{title}</h2>

          <ul className="flex flex-wrap gap-2 mb-4">
            {['PDF A4', 'Alta resolución', 'Descarga instantánea', 'Para imprimir'].map(f => (
              <li key={f} className="text-xs bg-gold/15 text-gold font-medium px-3 py-1 rounded-full">
                ✓ {f}
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-charcoal/40 mb-0.5">Precio</p>
              <p className="font-serif text-3xl font-bold text-charcoal">
                ${price} <span className="text-sm font-normal text-charcoal/40">ARS</span>
              </p>
            </div>
            <button
              onClick={handleBuy}
              className="flex items-center gap-2 bg-charcoal text-parchment px-6 py-3.5 rounded-full font-semibold hover:bg-gold transition-colors duration-300 text-sm"
            >
              Comprar <ArrowRight size={15} />
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-charcoal/30">
            🔒 Pago seguro con MercadoPago · PDF en tu mail al instante
          </p>
        </div>
      </div>
    </div>
  )
}
