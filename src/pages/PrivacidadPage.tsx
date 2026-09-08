const STORE_URL = '/'

export default function PrivacidadPage() {
  return (
    <div className="bg-parchment min-h-screen">
      <header className="border-b border-gold/20 bg-parchment/90">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-6">
          <a href={STORE_URL} className="font-serif text-lg font-bold text-charcoal/50 transition-colors hover:text-charcoal">
            ‹ Mundo de Colores
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-serif text-4xl font-bold text-charcoal">Política de Privacidad</h1>
        <p className="mt-2 text-sm text-charcoal/45">Última actualización: {new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long' })}</p>

        <div className="mt-10 grid gap-8 text-sm leading-relaxed text-charcoal/70">
          <p>
            En Mundo de Colores (un producto de NGM Studio) nos importa cómo usamos tu información. Esta página explica,
            en un lenguaje simple, qué datos recolectamos cuando comprás nuestros libros digitales y qué hacemos con ellos.
          </p>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal">¿Qué datos recolectamos?</h2>
            <p className="mt-2">
              Cuando comprás un libro, un pack o la colección completa, te pedimos tu <strong>nombre</strong> y tu <strong>email</strong>.
              Usamos esos datos únicamente para identificar tu compra y enviarte los archivos PDF que adquiriste. Si nos
              escribís por el formulario de contacto, también guardamos el mensaje que nos enviás para poder responderte.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal">¿Cómo se procesa el pago?</h2>
            <p className="mt-2">
              El pago se procesa a través de <strong>Mercado Pago</strong>. Nosotros nunca vemos ni almacenamos el número de tu
              tarjeta ni tus datos bancarios: eso queda a cargo de Mercado Pago, que tiene sus propias políticas de seguridad
              y privacidad.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal">¿Cómo se entregan los libros?</h2>
            <p className="mt-2">
              Una vez confirmado el pago, te enviamos un correo con los PDF a través de nuestro proveedor de email
              (Resend). Ese correo llega únicamente a la dirección que ingresaste al comprar.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal">Publicidad y estadísticas</h2>
            <p className="mt-2">
              Usamos el Píxel de Meta (Facebook/Instagram) para entender qué páginas visitás dentro de nuestro sitio y medir
              si nuestros anuncios funcionan. Esto no nos da acceso a tus datos personales de Facebook o Instagram, solo
              información general de navegación.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal">¿Compartimos tus datos con terceros?</h2>
            <p className="mt-2">
              No vendemos ni compartimos tu información con terceros para fines comerciales. Solo la compartimos con los
              proveedores que necesitamos para operar la tienda: Mercado Pago (para procesar el pago) y Resend (para
              enviarte el correo con tus PDF).
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal">Tus derechos</h2>
            <p className="mt-2">
              Podés pedirnos en cualquier momento que te digamos qué datos tenemos tuyos, que los corrijamos, o que los
              eliminemos de nuestros registros (excepto lo que necesitemos conservar por temas contables o legales).
              Para eso, escribinos desde el formulario de contacto de la tienda.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal">Cambios en esta política</h2>
            <p className="mt-2">
              Si actualizamos esta política, vamos a reflejar el cambio en esta misma página con una nueva fecha de
              actualización.
            </p>
          </section>

          <p className="mt-4 rounded-2xl bg-white/60 p-4 text-xs text-charcoal/45">
            Este texto es una guía general redactada para una tienda pequeña y no reemplaza el asesoramiento de un
            abogado. Si necesitás una política de privacidad con validez legal específica para tu situación, te
            recomendamos consultar con un profesional.
          </p>
        </div>
      </main>

      <footer className="border-t border-charcoal/10 px-6 py-8 text-center">
        <a href={STORE_URL} className="font-serif text-sm font-semibold text-charcoal/50 hover:text-charcoal">‹ Volver a Mundo de Colores</a>
      </footer>
    </div>
  )
}
