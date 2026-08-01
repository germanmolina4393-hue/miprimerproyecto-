import { ArrowRight, Check, ShieldCheck } from 'lucide-react'

export default function PricingSection() {
  return (
    <section id="comprar" className="bg-charcoal px-6 py-24">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-2xl sm:p-10">
        <p className="text-sm font-bold uppercase tracking-wider text-gold">Disponible ahora · NGM-MDC-001</p>
        <h2 className="mt-3 font-serif text-4xl font-bold text-charcoal">Dinosaurios para Colorear</h2>
        <p className="mt-3 text-charcoal/60">Un libro completo para imprimir, colorear, aprender y jugar.</p>
        <p className="mt-6 font-serif text-5xl font-bold text-charcoal">$4.900 <span className="text-base font-normal text-charcoal/50">ARS</span></p>
        <ul className="mx-auto mt-7 grid max-w-sm gap-3 text-left text-sm text-charcoal/70">
          {['28 páginas interiores + portada', 'PDF A4 listo para imprimir', 'Actividades y diploma final', 'Descarga habilitada al aprobarse el pago'].map(item => <li key={item} className="flex gap-2"><Check size={18} className="shrink-0 text-sage" />{item}</li>)}
        </ul>
        <a href="#categorias" className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-charcoal px-6 py-4 text-sm font-semibold text-parchment transition-colors hover:bg-gold">Comprar Dinosaurios <ArrowRight size={17} /></a>
        <p className="mt-4 flex items-center justify-center gap-2 text-xs text-charcoal/45"><ShieldCheck size={16} /> Pago seguro con Mercado Pago</p>
        <p className="mt-7 border-t border-charcoal/10 pt-5 text-xs leading-relaxed text-charcoal/45">Los otros títulos y packs estarán disponibles únicamente cuando cada PDF final esté listo para entregar.</p>
      </div>
    </section>
  )
}
