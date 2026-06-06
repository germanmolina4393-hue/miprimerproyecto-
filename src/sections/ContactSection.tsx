import { useState } from 'react'

export default function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data = new FormData(form)

    // Track Meta Pixel lead event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      ;(window as any).fbq('track', 'Lead')
    }

    try {
      // =====================================================================
      // OPCIÓN A — Formspree (gratis, recomendado):
      //   1. Creá una cuenta en formspree.io
      //   2. Creá un formulario y copiá el ID
      //   3. Reemplazá XXXXXXXX por tu ID
      // =====================================================================
      const res = await fetch('https://formspree.io/f/XXXXXXXX', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      setStatus(res.ok ? 'ok' : 'error')
      if (res.ok) form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contacto" className="py-24 px-6 bg-parchment">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl font-bold text-charcoal mb-4">
            ¿Tenés alguna <span className="living-gradient">pregunta</span>?
          </h2>
          <p className="text-charcoal/50">Te respondemos en menos de 24 hs.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Nombre *</label>
              <input
                type="text" name="nombre" required placeholder="Tu nombre"
                className="w-full border border-charcoal/15 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/40 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Email *</label>
              <input
                type="email" name="email" required placeholder="tu@email.com"
                className="w-full border border-charcoal/15 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/40 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Asunto</label>
            <input
              type="text" name="asunto" placeholder="¿Sobre qué querés consultar?"
              className="w-full border border-charcoal/15 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/40 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Mensaje *</label>
            <textarea
              name="mensaje" required rows={5} placeholder="Escribí tu consulta acá..."
              className="w-full border border-charcoal/15 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gold/40 transition resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full bg-charcoal text-parchment py-4 rounded-full font-semibold hover:bg-gold transition-colors duration-300 disabled:opacity-60"
          >
            {status === 'sending' ? 'Enviando...' : 'Enviar mensaje'}
          </button>

          {status === 'ok' && (
            <p className="text-center text-sage font-medium">✅ ¡Mensaje enviado! Te contactamos pronto.</p>
          )}
          {status === 'error' && (
            <p className="text-center text-coral font-medium">❌ Algo salió mal. Intentá de nuevo o escribinos por WhatsApp.</p>
          )}
        </form>
      </div>
    </section>
  )
}
