import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { X, ArrowRight, LoaderCircle, ShieldCheck } from 'lucide-react'
import TiltCard from './TiltCard'
import { createCheckout } from '../lib/checkout'

interface Props {
  title: string
  code: string
  badge: string
  available: boolean
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

function CategoryModal({ title, code, image, pages, price, description, badge, onClose }: Props & { onClose: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [])

  const continueToPayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSending(true)
    setError('')

    try {
      trackCheckout(title, price)
      await createCheckout({ name, email, productCode: code })
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'No pudimos iniciar el pago. Intentá nuevamente.')
      setSending(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[300] overflow-y-auto bg-charcoal/75 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="mx-auto my-5 w-full max-w-3xl overflow-hidden rounded-3xl bg-parchment shadow-2xl" onClick={event => event.stopPropagation()}>
        <div className="grid md:grid-cols-[0.8fr_1.2fr]">
          <div className="relative min-h-72 bg-white p-5 md:min-h-full">
            <img src={image} alt={`Portada de ${title}`} className="h-full max-h-[560px] w-full object-contain" />
            <span className="absolute left-5 top-5 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-white">{badge}</span>
          </div>

          <div className="relative p-6 sm:p-8">
            <button type="button" onClick={onClose} className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-charcoal/10 transition-colors hover:bg-charcoal/20" aria-label="Cerrar"><X size={18} /></button>
            <p className="pr-12 text-xs font-bold tracking-wide text-gold">{code}</p>
            <h3 className="mt-2 pr-12 font-serif text-3xl font-bold text-charcoal">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/60">{description}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full bg-sage/10 px-3 py-1.5 text-sage">PDF A4 · {pages} páginas</span>
              <span className="rounded-full bg-gold/10 px-3 py-1.5 text-gold">Contenido original NGM Studio</span>
            </div>

            <div className="mt-5 flex items-end justify-between gap-4 border-t border-charcoal/10 pt-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/45">Libro completo</p>
                <p className="font-serif text-3xl font-bold text-charcoal">${price} <span className="text-sm font-normal text-charcoal/45">ARS</span></p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-sage"><ShieldCheck size={15} /> Pago seguro</span>
            </div>

            <form className="mt-5" onSubmit={continueToPayment}>
              <div className="grid gap-3 sm:grid-cols-2">
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
      </div>
    </div>,
    document.body,
  )
}

export default function CategoryCard(props: Props) {
  const [open, setOpen] = useState(false)
  const { title, code, badge, image, pages, price, available } = props

  return (
    <>
      <TiltCard className={`group rounded-2xl overflow-hidden bg-white shadow-sm transition-shadow duration-500 card-overlay ${available ? 'cursor-pointer hover:shadow-xl' : 'opacity-75 cursor-default'}`} onClick={() => available && setOpen(true)}>
        <div className="relative overflow-hidden h-80 card-image-zoom bg-white">
          <img src={image} alt={`Portada de ${title}`} loading="lazy" className="w-full h-full object-contain p-3" />
          <span className="absolute top-3 left-3 bg-gold text-white text-xs font-semibold px-3 py-1 rounded-full">{badge}</span>
          <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-colors duration-300 flex items-center justify-center">
            <span className={`transition-opacity duration-300 bg-white text-charcoal text-xs font-semibold px-3 py-1.5 rounded-full ${available ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>{available ? 'Ver y comprar' : 'En preparación'}</span>
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
