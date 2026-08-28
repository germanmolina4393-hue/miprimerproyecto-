import { useState } from 'react'
import { ArrowRight, Check, ShieldCheck } from 'lucide-react'
import PackModal from '../components/PackModal'

export default function PricingSection() {
  const [showPackModal, setShowPackModal] = useState(false)

  return (
    <section id="comprar" className="bg-charcoal px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-4xl font-bold text-parchment">Packs y Colección</h2>
          <p className="mt-3 text-parchment/60">Ahorrá más llevando varios libros juntos</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Pack 3 Libros */}
          <div className="rounded-3xl bg-white/10 p-8 text-parchment">
            <p className="text-sm font-bold uppercase tracking-wider text-gold">Pack 3 Libros</p>
            <p className="mt-1 text-parchment/60 text-sm">Elegí tres aventuras del catálogo</p>
            <p className="mt-4 font-serif text-5xl font-bold">$11.900 <span className="text-base font-normal text-parchment/50">ARS</span></p>
            <ul className="mt-6 grid gap-3 text-sm text-parchment/70">
              {['3 libros completos en PDF', 'Formato A4 para imprimir', 'Elegís cualquier combinación', 'Ahorrás $2.800'].map(item => (
                <li key={item} className="flex gap-2"><Check size={18} className="shrink-0 text-sage" />{item}</li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-parchment/40">Elegís los 3 libros antes de pagar. Después del pago, los descargás al instante.</p>
            <button
              type="button"
              onClick={() => setShowPackModal(true)}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white/20 px-6 py-4 text-sm font-semibold text-parchment transition-colors hover:bg-gold hover:text-charcoal"
            >
              Elegir mis 3 libros <ArrowRight size={17} />
            </button>
          </div>

          {/* Colección Completa */}
          <div className="relative rounded-3xl bg-gold p-8 text-charcoal">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-sage px-4 py-1 text-xs font-bold text-white">Mejor precio por libro</span>
            <p className="text-sm font-bold uppercase tracking-wider text-charcoal/60">Colección Completa</p>
            <p className="mt-1 text-charcoal/60 text-sm">Los siete libros de Mundo de Colores</p>
            <p className="mt-4 font-serif text-5xl font-bold">$24.900 <span className="text-base font-normal text-charcoal/50">ARS</span></p>
            <ul className="mt-6 grid gap-3 text-sm text-charcoal/70">
              {['7 libros completos en PDF', '196 páginas interiores en total', 'Formato A4 para imprimir', 'Ahorrás $9.400'].map(item => (
                <li key={item} className="flex gap-2"><Check size={18} className="shrink-0 text-charcoal/60" />{item}</li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-charcoal/50">Recibís los siete libros después de verificar el pago.</p>
            <a href="https://mpago.la/1xJAgnk" target="_blank" rel="noopener noreferrer"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-charcoal px-6 py-4 text-sm font-semibold text-parchment transition-colors hover:bg-charcoal/80">
              Comprar con Mercado Pago <ArrowRight size={17} />
            </a>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-parchment/40">
          <ShieldCheck size={14} className="inline mr-1" />
          Pago seguro con Mercado Pago · Entrega por correo después de verificar el pago
        </p>
      </div>
      {showPackModal && <PackModal onClose={() => setShowPackModal(false)} />}
    </section>
  )
}
