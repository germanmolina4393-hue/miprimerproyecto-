import { useEffect, useRef } from 'react'
import {
  ArrowRight, Check, ShieldCheck, Mail, Printer,
  CreditCard, ChevronDown, Sparkles,
} from 'lucide-react'
import { useState } from 'react'
import { BOOKS } from '../books'
import { BOOK_COVERS } from '../bookCovers'

const UNIT_PRICE = 4900
const PACK3_PRICE = 11900
const BUNDLE_PRICE = 24900
const TOTAL_PAGES = BOOKS.reduce((sum, book) => sum + book.pages, 0)
const PACK3_SAVINGS = UNIT_PRICE * 3 - PACK3_PRICE
const BUNDLE_SAVINGS = UNIT_PRICE * BOOKS.length - BUNDLE_PRICE

// Todas las compras se hacen en la tienda principal — esta página solo informa y deriva ahí.
const STORE_URL = '/'
const BUY_SECTION_URL = `${STORE_URL}#comprar`
const BOOKS_SECTION_URL = `${STORE_URL}#categorias`

function money(value: number) {
  return value.toLocaleString('es-AR')
}

function trackPixel(event: string) {
  if (typeof window !== 'undefined' && window.fbq) window.fbq('track', event)
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
    q: '¿Cómo compro y recibo los libros?',
    a: 'Los botones de esta página te llevan a la tienda de Mundo de Colores, donde elegís tu opción y pagás con Mercado Pago. Apenas se confirma el pago, te llega un correo con los PDF listos para descargar.',
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

// ---------- Botón que lleva a la tienda (sin Mercado Pago en esta página) ----------
function StoreLink({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  return (
    <a href={href} onClick={() => trackPixel('InitiateCheckout')} className={className}>
      {children}
    </a>
  )
}

// ---------- Página principal ----------
export default function ColeccionCompletaPage() {
  const viewTracked = useRef(false)

  useEffect(() => {
    if (viewTracked.current) return
    viewTracked.current = true
    trackPixel('ViewContent')
  }, [])

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
          <a href={STORE_URL} className="font-serif text-lg font-bold text-charcoal/50 transition-colors hover:text-charcoal">
            ‹ Mundo de Colores
          </a>
          <StoreLink href={BUY_SECTION_URL} className="rounded-full bg-charcoal px-5 py-2.5 text-sm font-semibold text-parchment transition-colors hover:bg-gold">
            Ir a comprar
          </StoreLink>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden px-6 pb-20 pt-16 sm:pt-20">
        <div className="absolute right-[-10%] top-[-10%] h-72 w-72 rounded-full bg-coral/10 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] h-80 w-80 rounded-full bg-sage/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-1.5 text-xs font-bold tracking-wide text-gold">
              <Sparkles size={14} /> NGM Studio
            </span>
            <h1 className="mt-5 font-serif text-4xl font-bold leading-tight text-charcoal sm:text-5xl lg:text-6xl">
              Siete libros para <span className="living-gradient">colorear, jugar y aprender</span>, sin pantallas de por medio
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-charcoal/60 lg:mx-0">
              Mundo de Colores tiene {BOOKS.length} libros en PDF, pensados para chicos de 4 a 8 años y listos para
              imprimir en casa. Los podés comprar sueltos, en pack de 3, o llevarte la colección completa.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <StoreLink href={BUY_SECTION_URL} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-charcoal px-8 py-4 text-base font-semibold text-parchment transition-colors hover:bg-gold sm:w-auto">
                Ver precios y comprar <ArrowRight size={18} />
              </StoreLink>
              <p className="text-sm text-charcoal/50">
                Desde ${money(UNIT_PRICE)} ARS por libro
              </p>
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

      {/* LOS 3 PRECIOS */}
      <section className="bg-charcoal px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl font-bold text-parchment sm:text-4xl">Elegí cómo llevarte los libros</h2>
            <p className="mt-3 text-parchment/60">Cuantos más libros lleves juntos, menos pagás por cada uno</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Libro individual */}
            <div className="rounded-3xl bg-white/10 p-8 text-parchment">
              <p className="text-sm font-bold uppercase tracking-wider text-gold">Un libro</p>
              <p className="mt-1 text-sm text-parchment/60">Elegís el que más te guste</p>
              <p className="mt-4 font-serif text-4xl font-bold">${money(UNIT_PRICE)} <span className="text-base font-normal text-parchment/50">ARS</span></p>
              <ul className="mt-6 grid gap-3 text-sm text-parchment/70">
                {['1 libro completo en PDF', 'Formato A4 para imprimir', 'Ideal para probar la colección'].map(item => (
                  <li key={item} className="flex gap-2"><Check size={18} className="shrink-0 text-sage" />{item}</li>
                ))}
              </ul>
              <StoreLink href={BOOKS_SECTION_URL} className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white/20 px-6 py-3.5 text-sm font-semibold text-parchment transition-colors hover:bg-gold hover:text-charcoal">
                Elegir un libro <ArrowRight size={16} />
              </StoreLink>
            </div>

            {/* Pack 3 */}
            <div className="rounded-3xl bg-white/10 p-8 text-parchment">
              <p className="text-sm font-bold uppercase tracking-wider text-gold">Pack 3 libros</p>
              <p className="mt-1 text-sm text-parchment/60">Elegís tres aventuras del catálogo</p>
              <p className="mt-4 font-serif text-4xl font-bold">${money(PACK3_PRICE)} <span className="text-base font-normal text-parchment/50">ARS</span></p>
              <ul className="mt-6 grid gap-3 text-sm text-parchment/70">
                {['3 libros completos en PDF', 'Formato A4 para imprimir', 'Elegís cualquier combinación', `Ahorrás $${money(PACK3_SAVINGS)}`].map(item => (
                  <li key={item} className="flex gap-2"><Check size={18} className="shrink-0 text-sage" />{item}</li>
                ))}
              </ul>
              <StoreLink href={BUY_SECTION_URL} className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white/20 px-6 py-3.5 text-sm font-semibold text-parchment transition-colors hover:bg-gold hover:text-charcoal">
                Elegir mis 3 libros <ArrowRight size={16} />
              </StoreLink>
            </div>

            {/* Colección completa */}
            <div className="relative rounded-3xl bg-gold p-8 text-charcoal">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-sage px-4 py-1 text-xs font-bold text-white">Mejor precio por libro</span>
              <p className="text-sm font-bold uppercase tracking-wider text-charcoal/60">Colección completa</p>
              <p className="mt-1 text-sm text-charcoal/60">Los siete libros de Mundo de Colores</p>
              <p className="mt-4 font-serif text-4xl font-bold">${money(BUNDLE_PRICE)} <span className="text-base font-normal text-charcoal/50">ARS</span></p>
              <ul className="mt-6 grid gap-3 text-sm text-charcoal/70">
                {['7 libros completos en PDF', `${money(TOTAL_PAGES)} páginas en total`, 'Formato A4 para imprimir', `Ahorrás $${money(BUNDLE_SAVINGS)}`].map(item => (
                  <li key={item} className="flex gap-2"><Check size={18} className="shrink-0 text-charcoal/60" />{item}</li>
                ))}
              </ul>
              <StoreLink href={BUY_SECTION_URL} className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-charcoal px-6 py-3.5 text-sm font-semibold text-parchment transition-colors hover:bg-charcoal/80">
                Comprar la colección <ArrowRight size={16} />
              </StoreLink>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-parchment/40">
            <ShieldCheck size={14} className="inline mr-1" />
            El pago se hace en la tienda de Mundo de Colores, con Mercado Pago
          </p>
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
              { icon: CreditCard, title: 'Elegís y pagás en la tienda', text: 'Vas a la tienda de Mundo de Colores, elegís tu opción y pagás de forma segura con Mercado Pago.' },
              { icon: Mail, title: 'Te llegan los PDF', text: 'En minutos recibís un correo con los libros listos para descargar.' },
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
            ¿Uno, tres o los siete? Vos elegís
          </h2>
          <p className="mx-auto mt-4 max-w-md text-charcoal/60">
            Entrá a la tienda de Mundo de Colores para ver las tres opciones y pagar de forma segura con Mercado Pago.
          </p>
          <StoreLink href={BUY_SECTION_URL} className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-charcoal px-9 py-4 text-base font-semibold text-parchment transition-colors hover:bg-charcoal/85">
            Ir a la tienda <ArrowRight size={18} />
          </StoreLink>
          <p className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-sage">
            <ShieldCheck size={15} /> Pago seguro con Mercado Pago
          </p>
        </div>
      </section>

      <footer className="bg-charcoal px-6 py-8 text-center">
        <p className="font-serif text-lg living-gradient font-bold">Mundo de Colores</p>
        <p className="mt-2 text-xs text-parchment/40">© {new Date().getFullYear()} NGM Studio. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
