import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight, Check, ShieldCheck, X, LoaderCircle } from 'lucide-react'
import { createPortal } from 'react-dom'
import PackModal from '../components/PackModal'
import { createCheckout } from '../lib/checkout'

function FullCollectionModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const continueToPayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSending(true)
    setError('')
    try {
      await createCheckout({ name, email, productCode: 'FULL7' })
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'No pudimos iniciar el pago. Intentá nuevamente.')
      setSending(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[300] overflow-y-auto bg-charcoal/75 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="mx-auto my-5 w-full max-w-md overflow-hidden rounded-3xl bg-parchment shadow-2xl" onClick={event => event.stopPropagation()}>
        <div className="relative p-6 sm:p-8">
          <button type="button" onClick={onClose} className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-charcoal/10 transition-colors hover:bg-charcoal/20" aria-label="Cerrar">
            <X size={18} />
          </button>
          <p className="pr-12 text-xs font-bold tracking-wide text-gold">COLECCIÓN COMPLETA</p>
          <h3 className="mt-2 pr-12 font-serif text-3xl font-bold text-charcoal">Los 7 libros</h3>
          <p className="mt-3 text-sm leading-relaxed text-charcoal/60">Recibís acceso a los 7 libros de Mundo de Colores en PDF, listos para descargar apenas se apruebe el pago.</p>

          <div className="mt-5 flex items-end justify-between gap-4 border-t border-charcoal/10 pt-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/45">Colección Completa</p>
              <p className="font-serif text-3xl font-bold text-charcoal">$24.900 <span className="text-sm font-normal text-charcoal/45">ARS</span></p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-sage"><ShieldCheck size={15} /> Pago seguro</span>
          </div>

          <form className="mt-5" onSubmit={continueToPayment}>
            <div className="grid gap-3">
              <label className="text-xs font-semibold text-charcoal">Nombre y apellido
                <input required value={name} onChange={event => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-charcoal/15 bg-white px-3 py-2.5 text-sm font-normal outline-none transition-colors focus:border-gold" placeholder="Tu nombre" />
              </label>
              <label className="text-xs font-semibold text-charcoal">Correo para recibir el PDF
                <input required type="email" value={email} onChange={event => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-charcoal/15 bg-white px-3 py-2.5 text-sm font-normal outline-none transition-colors focus:border-gold" placeholder="tu@email.com" />
              </label>
            </div>
            {error && <p className="mt-3 rounded-xl bg-coral/10 px-3 py-2.5 text-xs font-semibold text-coral" role="alert">{error}</p>}
            <button type="submit" disabled={sending} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-charcoal px-6 py-3.5 text-sm font-semibold text-parchment transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-50">
              {sending ? <><LoaderCircle size={16} className="animate-spin" /> Guardando tus datos…</> : <>Continuar a Mercado Pago <ArrowRight size={16} /></>}
            </button>
            <p className="mt-3 text-center text-xs text-charcoal/45">Usá este mismo correo en Mercado Pago para identificar tu compra.</p>
          </form>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default function PricingSection() {
  const [showPackModal, setShowPackModal] = useState(false)
  const [showFullModal, setShowFullModal] = useState(false)

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
            <button
              type="button"
              onClick={() => setShowFullModal(true)}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-charcoal px-6 py-4 text-sm font-semibold text-parchment transition-colors hover:bg-charcoal/80"
            >
              Comprar con Mercado Pago <ArrowRight size={17} />
            </button>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-parchment/40">
          <ShieldCheck size={14} className="inline mr-1" />
          Pago seguro con Mercado Pago · Entrega por correo después de verificar el pago
        </p>
      </div>
      {showPackModal && <PackModal onClose={() => setShowPackModal(false)} />}
      {showFullModal && <FullCollectionModal onClose={() => setShowFullModal(false)} />}
    </section>
  )
}
