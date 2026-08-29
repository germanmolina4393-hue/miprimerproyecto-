import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { X, ArrowRight, LoaderCircle, ShieldCheck, Check } from 'lucide-react'
import { createCheckout } from '../lib/checkout'
import { BOOKS } from '../books'

interface Props {
  onClose: () => void
}

export default function PackModal({ onClose }: Props) {
  const [selected, setSelected] = useState<string[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previousOverflow }
  }, [])

  function toggleBook(code: string) {
    setError('')
    setSelected(current => {
      if (current.includes(code)) {
        return current.filter(item => item !== code)
      }
      if (current.length >= 3) return current
      return [...current, code]
    })
  }

  const continueToPayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    if (selected.length !== 3) {
      setError('Elegí exactamente 3 libros para continuar.')
      return
    }
    setSending(true)
    try {
      await createCheckout({ name, email, productCode: 'PACK3', selectedCodes: selected })
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'No pudimos iniciar el pago. Intentá nuevamente.')
      setSending(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[300] overflow-y-auto bg-charcoal/75 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="mx-auto my-5 w-full max-w-3xl overflow-hidden rounded-3xl bg-parchment shadow-2xl" onClick={event => event.stopPropagation()}>
        <div className="relative p-6 sm:p-8">
          <button type="button" onClick={onClose} className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-charcoal/10 transition-colors hover:bg-charcoal/20" aria-label="Cerrar">
            <X size={18} />
          </button>

          <p className="pr-12 text-xs font-bold tracking-wide text-gold">PACK 3 LIBROS</p>
          <h3 className="mt-2 pr-12 font-serif text-3xl font-bold text-charcoal">Elegí tus 3 libros</h3>
          <p className="mt-2 text-sm text-charcoal/60">Seleccionados: {selected.length} / 3</p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 max-h-72 overflow-y-auto pr-1">
            {BOOKS.filter(book => book.available).map(book => {
              const isSelected = selected.includes(book.code)
              return (
                <button
                  type="button"
                  key={book.code}
                  onClick={() => toggleBook(book.code)}
                  className={`relative rounded-2xl border-2 p-2 text-left transition-colors ${isSelected ? 'border-gold bg-gold/10' : 'border-charcoal/10 bg-white hover:border-charcoal/25'}`}
                >
                  {isSelected && (
                    <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-white">
                      <Check size={12} />
                    </span>
                  )}
                  <img src={book.image} alt={book.title} className="h-24 w-full object-contain" />
                  <p className="mt-1 text-xs font-semibold text-charcoal">{book.title}</p>
                </button>
              )
            })}
          </div>

          <form className="mt-6" onSubmit={continueToPayment}>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-semibold text-charcoal">Nombre y apellido
                <input required value={name} onChange={event => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-charcoal/15 bg-white px-3 py-2.5 text-sm font-normal outline-none transition-colors focus:border-gold" placeholder="Tu nombre" />
              </label>
              <label className="text-xs font-semibold text-charcoal">Correo para recibir el PDF
                <input required type="email" value={email} onChange={event => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-charcoal/15 bg-white px-3 py-2.5 text-sm font-normal outline-none transition-colors focus:border-gold" placeholder="tu@email.com" />
              </label>
            </div>

            <div className="mt-5 flex items-end justify-between gap-4 border-t border-charcoal/10 pt-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/45">Pack 3 Libros</p>
                <p className="font-serif text-3xl font-bold text-charcoal">$11.900 <span className="text-sm font-normal text-charcoal/45">ARS</span></p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-sage"><ShieldCheck size={15} /> Pago seguro</span>
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
