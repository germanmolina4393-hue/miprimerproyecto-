import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Check, LoaderCircle, ShieldCheck, X } from 'lucide-react'
import { BOOKS } from '../books'

gsap.registerPlugin(ScrollTrigger)

const PACK_LINK = 'https://mpago.la/242QJqb'

const PLANS = [
  {
    name: 'Pack 3 Libros',
    price: '11.900',
    description: 'Elegí tres aventuras del catálogo',
    features: ['3 libros completos en PDF', 'Formato A4 para imprimir', 'Elegís cualquier combinación', 'Ahorrás $2.800'],
    link: PACK_LINK,
    highlight: false,
    requiresSelection: true,
    note: 'Primero elegís los tres títulos y después continuás al pago.',
  },
  {
    name: 'Colección Completa',
    price: '24.900',
    description: 'Los siete libros de Mundo de Colores',
    features: ['7 libros completos en PDF', '196 páginas interiores en total', 'Formato A4 para imprimir', 'Ahorrás $9.400'],
    link: 'https://mpago.la/1xJAgnk',
    highlight: true,
    requiresSelection: false,
    note: 'Recibís los siete libros después de verificar el pago.',
  },
]

function trackCheckout(name: string, price: string) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      content_name: name,
      value: Number(price.replace('.', '')),
      currency: 'ARS',
    })
  }
}

function PackSelectionModal({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<string[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const toggleBook = (code: string) => {
    setError('')
    setSelected(current => {
      if (current.includes(code)) return current.filter(item => item !== code)
      if (current.length === 3) return current
      return [...current, code]
    })
  }

  const submitSelection = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (selected.length !== 3) {
      setError('Elegí exactamente tres libros para continuar.')
      return
    }

    setSending(true)
    setError('')
    const chosenBooks = selected.map(code => {
      const book = BOOKS.find(item => item.code === code)
      return book ? `${book.title} (${book.code})` : code
    })

    try {
      const response = await fetch('https://formspree.io/f/xykakpav', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          nombre: name,
          email,
          producto: 'Pack 3 Libros – Mundo de Colores',
          libros_elegidos: chosenBooks.join(' | '),
          importe: '$11.900 ARS',
          _subject: `Selección Pack 3 – ${name}`,
        }),
      })

      if (!response.ok) throw new Error('No se pudo guardar la selección')
      trackCheckout('Pack 3 Libros', '11.900')
      window.location.href = PACK_LINK
    } catch {
      setError('No pudimos guardar la selección. Revisá tu conexión e intentá nuevamente.')
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[250] overflow-y-auto bg-charcoal/75 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="mx-auto my-6 w-full max-w-4xl rounded-3xl bg-parchment p-5 shadow-2xl sm:p-8" onClick={event => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-gold">Pack 3 Libros · $11.900 ARS</p>
            <h3 className="mt-1 font-serif text-3xl font-bold text-charcoal">Elegí tus tres aventuras</h3>
            <p className="mt-2 text-sm text-charcoal/55">Seleccioná exactamente tres títulos. Después ingresarás a Mercado Pago.</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-charcoal/10 transition-colors hover:bg-charcoal/20" aria-label="Cerrar selección"><X size={18} /></button>
        </div>

        <form className="mt-7" onSubmit={submitSelection}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
            {BOOKS.map(book => {
              const isSelected = selected.includes(book.code)
              const isDisabled = selected.length === 3 && !isSelected
              return (
                <button key={book.code} type="button" disabled={isDisabled} onClick={() => toggleBook(book.code)} className={`relative overflow-hidden rounded-2xl border-2 bg-white p-2 text-left transition-all ${isSelected ? 'border-gold shadow-lg -translate-y-1' : 'border-transparent hover:border-gold/40'} ${isDisabled ? 'cursor-not-allowed opacity-45' : ''}`}>
                  <img src={book.image} alt={`Portada de ${book.title}`} className="aspect-[1/1.414] w-full rounded-xl object-cover" />
                  <span className={`absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold ${isSelected ? 'border-gold bg-gold text-white' : 'border-charcoal/20 bg-white text-transparent'}`}>✓</span>
                  <span className="mt-2 block text-xs font-bold leading-tight text-charcoal">{book.title}</span>
                  <span className="mt-1 block text-[10px] font-semibold text-gold">{book.code}</span>
                </button>
              )
            })}
          </div>

          <div className="mt-5 flex items-center justify-between rounded-2xl bg-gold/10 px-4 py-3 text-sm">
            <span className="font-semibold text-charcoal">Libros seleccionados</span>
            <span className={`font-bold ${selected.length === 3 ? 'text-sage' : 'text-gold'}`}>{selected.length} de 3</span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-charcoal">Nombre y apellido
              <input required value={name} onChange={event => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-charcoal/15 bg-white px-4 py-3 font-normal outline-none transition-colors focus:border-gold" placeholder="Tu nombre" />
            </label>
            <label className="text-sm font-semibold text-charcoal">Correo para recibir los PDF
              <input required type="email" value={email} onChange={event => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-charcoal/15 bg-white px-4 py-3 font-normal outline-none transition-colors focus:border-gold" placeholder="tu@email.com" />
            </label>
          </div>

          {error && <p className="mt-4 rounded-xl bg-coral/10 px-4 py-3 text-sm font-semibold text-coral" role="alert">{error}</p>}

          <button type="submit" disabled={sending || selected.length !== 3} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-charcoal px-6 py-4 text-sm font-semibold text-parchment transition-colors hover:bg-gold disabled:cursor-not-allowed disabled:opacity-40">
            {sending ? <><LoaderCircle size={17} className="animate-spin" /> Guardando tu selección…</> : <>Continuar al pago <ArrowRight size={17} /></>}
          </button>
          <p className="mt-3 text-center text-xs text-charcoal/45">Usá el mismo correo en la selección y en Mercado Pago para identificar tu compra.</p>
        </form>
      </div>
    </div>
  )
}

export default function PricingSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [packOpen, setPackOpen] = useState(false)

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll('.pricing-card')
    if (!cards?.length) return
    gsap.fromTo(cards, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, stagger: 0.12, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: containerRef.current, start: 'top 85%', toggleActions: 'play none none none' },
    })
  }, [])

  return (
    <section id="comprar" className="py-24 px-6 bg-charcoal">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-parchment mb-4">Elegí la opción que más te <span className="living-gradient">conviene</span></h2>
          <p className="text-parchment/50 text-lg">También podés comprar cada libro por separado a $4.900.</p>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PLANS.map(plan => (
            <article key={plan.name} className={`pricing-card relative rounded-3xl p-7 flex flex-col ${plan.highlight ? 'bg-gold text-charcoal shadow-2xl' : 'bg-white/5 text-parchment border border-white/10'}`}>
              {plan.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-coral text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">Mejor precio por libro</span>}
              <p className={`text-sm font-semibold mb-1 ${plan.highlight ? 'text-charcoal/60' : 'text-parchment/45'}`}>{plan.name}</p>
              <p className={`font-serif text-4xl font-bold mb-1 ${plan.highlight ? 'text-charcoal' : 'text-parchment'}`}>${plan.price}<span className={`text-sm font-normal ml-1 ${plan.highlight ? 'text-charcoal/50' : 'text-parchment/40'}`}>ARS</span></p>
              <p className={`text-sm mb-6 ${plan.highlight ? 'text-charcoal/60' : 'text-parchment/45'}`}>{plan.description}</p>
              <ul className="space-y-3 mb-6 flex-1">
                {plan.features.map(feature => <li key={feature} className={`flex items-start gap-2 text-sm ${plan.highlight ? 'text-charcoal/80' : 'text-parchment/65'}`}><Check size={17} className="mt-0.5 shrink-0 text-sage" /> {feature}</li>)}
              </ul>
              <p className={`mb-5 text-xs leading-relaxed ${plan.highlight ? 'text-charcoal/55' : 'text-parchment/40'}`}>{plan.note}</p>
              {plan.requiresSelection ? (
                <button type="button" onClick={() => setPackOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-full bg-parchment/10 py-3.5 text-sm font-semibold text-parchment transition-all duration-300 hover:bg-gold hover:text-charcoal">Elegir mis 3 libros <ArrowRight size={15} /></button>
              ) : (
                <a href={plan.link} target="_blank" rel="noopener noreferrer" onClick={() => trackCheckout(plan.name, plan.price)} className="flex w-full items-center justify-center gap-2 rounded-full bg-charcoal py-3.5 text-sm font-semibold text-parchment transition-all duration-300 hover:bg-charcoal/80">Comprar con Mercado Pago <ArrowRight size={15} /></a>
              )}
            </article>
          ))}
        </div>
        <p className="mt-8 flex items-center justify-center gap-2 text-center text-sm text-parchment/40"><ShieldCheck size={17} /> Pago seguro con Mercado Pago · Entrega por correo después de verificar el pago</p>
      </div>
      {packOpen && <PackSelectionModal onClose={() => setPackOpen(false)} />}
    </section>
  )
}
