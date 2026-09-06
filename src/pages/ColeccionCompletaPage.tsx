import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { createPortal } from 'react-dom'
import {
  ArrowRight, ShieldCheck, X, LoaderCircle, Mail, Printer,
  CreditCard, ChevronDown, Sparkles,
} from 'lucide-react'
import { BOOKS } from '../books'
import { BOOK_COVERS } from '../bookCovers'
import { createCheckout } from '../lib/checkout'

const UNIT_PRICE = 4900
const BUNDLE_PRICE = 24900
const TOTAL_PAGES = BOOKS.reduce((sum, book) => sum + book.pages, 0)
const SAVINGS = UNIT_PRICE * BOOKS.length - BUNDLE_PRICE

function money(value: number) {
  return value.toLocaleString('es-AR')
}

function trackPixel(event: string) {
  if (typeof window !== 'undefined' && window.fbq) window.fbq('track', event)
}

// ---------- Modal de compra ----------
function CheckoutModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const submit = async (event: FormEvent<HTMLFormElement>) => {
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
          <p className="mt-3 text-sm leading-relaxed text-charcoal/60">
            Te llegan los {BOOKS.length} PDF a tu correo apenas se apruebe el pago, listos para imprimir.
          </p>

          <div className="mt-5 flex items-end justify-between gap-4 border-t border-charcoal/10 pt-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/45">Colección Completa</p>
              <p className="font-serif text-3xl font-bold text-charcoal">${money(BUNDLE_PRICE)} <span className="text-sm font-normal text-charcoal/45">ARS</span></p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-sage"><ShieldCheck size={15} /> Pago seguro</span>
          </div>

          <form className="mt-5" onSubmit={submit}>
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

// ---------- Pila de portadas para el hero ----------
function CoverStack() {
  const featured: Array<{ key: keyof typeof BOOK_COVERS; title: string }> = [
    { key: 'dinosaurios', title: 'Dinosaurios para Colorear' },
    { key: 'unicornios', title: 'Unicornios para Colorear' },
    { key: 'mundo-marino', title: 'Mundo Marino' },
    { key: 'vehiculos', title: 'Vehículos para Colorear' },
    { key: 'navidad', title: 'Navidad para Colorear' },
  ]
  const layout = [
    { rotate: -14, x: -120, y: 18, z: 1 },
    { rotate: -6, x: -60, y: -6, z: 2 },
    { rotate: 2, x: 4, y: 10, z: 4 },
    { rotate: 9, x: 62, y: -10, z: 3 },
    { rotate: 16, x: 118, y: 16, z: 1 },
  ]

  return (
    <div className="relative mx-auto h-[280px] w-full max-w-md sm:h-[340px]">
      {featured.map((item, index) => {
        const pos = layout[index]
        return (
          <div
            key={item.key}
            className="cover-fan absolute left-1/2 top-1/2 w-[150px] overflow-hidden rounded-lg border-4 border-white shadow-2xl sm:w-[180px]"
            style={{
              '--rot': `${pos.rotate}deg`,
              '--tx': `${pos.x}px`,
              '--ty': `${pos.y}px`,
              zIndex: pos.z,
              animationDelay: `${index * 90}ms`,
            } as React.CSSProperties}
          >
            <img src={BOOK_COVERS[item.key]} alt={item.title} className="block h-full w-full object-cover" />
          </div>
        )
      })}
    </div>
  )
}

// ---------- FAQ ----------
const FAQ_ITEMS = [
  {
    q: '¿Cómo recibo los libros después de pagar?',
    a: `Apenas Mercado Pago confirma el pago, te llega un correo con los ${BOOKS.length} PDF listos para descargar. Normalmente llega en minutos.`,
  },
  {
    q: '¿Necesito una impresora especial?',
    a: 'No. Los libros están armados en formato A4, el mismo que usa cualquier impresora hogareña o de librería.',
  },
  {
    q: '¿Puedo imprimirlos las veces que quiera?',
    a: 'Sí. Una vez que los descargás son tuyos: podés imprimirlos para tus hijos todas las veces que necesites.',
  },
  {
    q: '¿El contenido es original de Mundo de Colores?',
    a: 'Sí, los siete libros fueron creados por NGM Studio especialmente para chicos de 4 a 8 años, con ilustraciones y actividades propias.',
  },
  {
    q: '¿Qué pasa si no me llega el correo con los PDF?',
    a: 'Nos escribís y te reenviamos el material directamente. El pago queda registrado con tu correo, así que siempre podemos recuperar tu compra.',
  },
]

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="divide-y divide-charcoal/10 rounded-3xl border border-charcoal/10 bg-white/60">
      {FAQ_ITEMS.map((item, index) => {
        const isOpen = open === index
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-serif text-lg font-semibold text-charcoal">{item.q}</span>
              <ChevronDown size={20} className={`shrink-0 text-charcoal/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-sm leading-relaxed text-charcoal/60">{item.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ---------- Página principal ----------
export default function ColeccionCompletaPage() {
  const [showModal, setShowModal] = useState(false)
  const viewTracked = useRef(false)

  useEffect(() => {
    if (viewTracked.current) return
    viewTracked.current = true
    trackPixel('ViewContent')
  }, [])

  const openCheckout = () => {
    trackPixel('InitiateCheckout')
    setShowModal(true)
  }

  return (
    <div className="bg-parchment">
      {/* Estilos propios de esta página, autocontenidos */}
      <style>{`
        @keyframes coverFan {
          from { transform: translate(-50%, -50%) rotate(0deg) scale(0.9); opacity: 0; }
          to { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) rotate(var(--rot)) scale(1); opacity: 1; }
        }
        .cover-fan {
          transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) rotate(var(--rot));
          animation: coverFan 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @media (prefers-reduced-motion: reduce) {
          .cover-fan { animation: none; }
        }
        .dog-ear::after {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 0; height: 0;
          border-style: solid;
          border-width: 0 26px 26px 0;
          border-color: transparent #FAF5EF transparent transparent;
          filter: drop-shadow(-1px 1px 1px rgba(0,0,0,0.15));
        }
      `}</style>

      {/* Barra superior minimalista, enfocada en conversión */}
      <header className="sticky top-0 z-50 border-b border-gold/20 bg-parchment/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a href="/" className="font-serif text-lg font-bold text-charcoal/50 transition-colors hover:text-charcoal">
            ‹ Mundo de Colores
          </a>
          <button
            type="button"
            onClick={openCheckout}
            className="rounded-full bg-charcoal px-5 py-2.5 text-sm font-semibold text-parchment transition-colors hover:bg-gold"
          >
            Comprar ahora
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden px-6 pb-20 pt-16 sm:pt-20">
        <div className="absolute right-[-10%] top-[-10%] h-72 w-72 rounded-full bg-coral/10 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] h-80 w-80 rounded-full bg-sage/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-1.5 text-xs font-bold tracking-wide text-gold">
              <Sparkles size={14} /> Colección Completa · NGM Studio
            </span>
            <h1 className="mt-5 font-serif text-4xl font-bold leading-tight text-charcoal sm:text-5xl lg:text-6xl">
              Siete libros para <span className="living-gradient">colorear, jugar y aprender</span>, sin pantallas de por medio
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-charcoal/60 lg:mx-0">
              La Colección Completa de Mundo de Colores junta los {BOOKS.length} libros de NGM Studio en un solo pack:
              {' '}{money(TOTAL_PAGES)} páginas en PDF, pensadas para chicos de 4 a 8 años y listas para imprimir en casa.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <button
                type="button"
                onClick={openCheckout}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-charcoal px-8 py-4 text-base font-semibold text-parchment transition-colors hover:bg-gold sm:w-auto"
              >
                Quiero los 7 libros <ArrowRight size={18} />
              </button>
              <div className="text-center sm:text-left">
                <p className="font-serif text-2xl font-bold text-charcoal">
                  ${money(BUNDLE_PRICE)} <span className="text-sm font-normal text-charcoal/45">ARS · pago único</span>
                </p>
                <p className="text-xs text-charcoal/45 line-through">${money(UNIT_PRICE * BOOKS.length)} ARS comprados por separado</p>
              </div>
            </div>

            <div className="mx-auto mt-8 flex max-w-md flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-charcoal/50 lg:mx-0 lg:justify-start">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck size={15} className="text-sage" /> Pago seguro con Mercado Pago</span>
              <span className="inline-flex items-center gap-1.5"><Mail size={15} className="text-sage" /> Entrega por correo</span>
              <span className="inline-flex items-center gap-1.5"><Printer size={15} className="text-sage" /> Formato A4 para imprimir</span>
            </div>
          </div>

          <CoverStack />
        </div>
      </section>

      {/* PROMESA */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-bold text-charcoal sm:text-4xl">
            Una tarde sin pantallas ya está resuelta
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-charcoal/60">
            Dinosaurios, animales de granja, el fondo del mar, vehículos, unicornios, Navidad y las cuatro estaciones:
            siete mundos distintos para que cada tarde de colorear sea una aventura nueva, con datos curiosos y actividades
            pensadas para acompañar el aprendizaje de los más chicos.
          </p>
        </div>
      </section>

      {/* GALERÍA DE LOS 7 LIBROS */}
      <section className="bg-white/50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl font-bold text-charcoal sm:text-4xl">Los {BOOKS.length} libros, uno por uno</h2>
            <p className="mt-3 text-charcoal/60">28 páginas cada uno · {money(TOTAL_PAGES)} páginas en total</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BOOKS.map((book, index) => (
              <div key={book.code} className="dog-ear relative overflow-hidden rounded-2xl bg-parchment shadow-md">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={book.image} alt={book.title} className="h-full w-full object-cover" />
                  <span className="absolute left-3 top-3 rounded-full bg-charcoal/80 px-2.5 py-1 text-[11px] font-semibold text-parchment">
                    Libro {index + 1} de {BOOKS.length}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-base font-bold leading-snug text-charcoal">{book.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-charcoal/55">{book.description}</p>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-gold">{book.pages} páginas</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALOR / RECIBO */}
      <section className="bg-charcoal px-6 py-20">
        <div className="mx-auto max-w-lg">
          <div className="mb-10 text-center">
            <h2 className="font-serif text-3xl font-bold text-parchment sm:text-4xl">Así se arma el ahorro</h2>
            <p className="mt-3 text-parchment/60">Comprando la colección pagás menos que si llevaras los libros de a uno</p>
          </div>

          <div className="rounded-3xl border border-dashed border-parchment/25 bg-white/5 p-8">
            <div className="flex items-center justify-between text-sm text-parchment/70">
              <span>{BOOKS.length} libros × ${money(UNIT_PRICE)}</span>
              <span>${money(UNIT_PRICE * BOOKS.length)}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-sage">
              <span>Descuento por colección completa</span>
              <span>−${money(SAVINGS)}</span>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-parchment/15 pt-5">
              <span className="font-serif text-lg font-bold text-parchment">Total colección</span>
              <span className="font-serif text-3xl font-bold text-parchment">${money(BUNDLE_PRICE)}</span>
            </div>
            <button
              type="button"
              onClick={openCheckout}
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-4 text-sm font-semibold text-charcoal transition-colors hover:bg-parchment"
            >
              Comprar con Mercado Pago <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <h2 className="font-serif text-3xl font-bold text-charcoal sm:text-4xl">Cómo lo recibís</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { icon: CreditCard, title: 'Pagás con Mercado Pago', text: 'Ingresás tu nombre y correo, y pagás de forma segura con cualquier medio disponible en Mercado Pago.' },
              { icon: Mail, title: 'Te llegan los 7 PDF', text: 'En minutos recibís un correo con los siete libros listos para descargar.' },
              { icon: Printer, title: 'Imprimís y a colorear', text: 'Los imprimís en formato A4 las veces que quieras y arrancás la aventura.' },
            ].map((step, index) => (
              <div key={step.title} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold">
                  <step.icon size={24} />
                </div>
                <p className="text-xs font-bold uppercase tracking-wide text-charcoal/40">Paso {index + 1}</p>
                <h3 className="mt-1 font-serif text-xl font-bold text-charcoal">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/60">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white/50 px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-10 text-center font-serif text-3xl font-bold text-charcoal sm:text-4xl">Preguntas frecuentes</h2>
          <FaqAccordion />
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-2xl rounded-3xl bg-gold/15 px-8 py-14 text-center">
          <h2 className="font-serif text-3xl font-bold text-charcoal sm:text-4xl">
            Llevate los {BOOKS.length} libros por ${money(BUNDLE_PRICE)}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-charcoal/60">
            Pago único, entrega inmediata por correo. Si tenés algún problema para descargar tus PDF, te ayudamos por
            mail hasta resolverlo.
          </p>
          <button
            type="button"
            onClick={openCheckout}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-charcoal px-9 py-4 text-base font-semibold text-parchment transition-colors hover:bg-charcoal/85"
          >
            Comprar la Colección Completa <ArrowRight size={18} />
          </button>
          <p className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-sage">
            <ShieldCheck size={15} /> Pago seguro con Mercado Pago
          </p>
        </div>
      </section>

      <footer className="bg-charcoal px-6 py-8 text-center">
        <p className="font-serif text-lg living-gradient font-bold">Mundo de Colores</p>
        <p className="mt-2 text-xs text-parchment/40">© {new Date().getFullYear()} NGM Studio. Todos los derechos reservados.</p>
      </footer>

      {showModal && <CheckoutModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
