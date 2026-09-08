const STORE_URL = '/'

export default function TerminosPage() {
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
        <h1 className="font-serif text-4xl font-bold text-charcoal">Términos y Condiciones</h1>
        <p className="mt-2 text-sm text-charcoal/45">Última actualización: {new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long' })}</p>

        <div className="mt-10 grid gap-8 text-sm leading-relaxed text-charcoal/70">
          <p>
            Al comprar en Mundo de Colores (un producto de NGM Studio) estás aceptando estos términos. Los escribimos en
            un lenguaje simple para que sepas exactamente qué estás comprando y cómo funciona todo.
          </p>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal">Qué vendemos</h2>
            <p className="mt-2">
              Vendemos libros para colorear en formato <strong>PDF descargable</strong>, pensados para chicos de 4 a 8 años.
              No son productos físicos: no hay envío por correo postal, se entregan por email en formato digital, listos
              para imprimir en tu casa.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal">Precios y formas de pago</h2>
            <p className="mt-2">
              Los precios están expresados en pesos argentinos (ARS) e incluyen los impuestos correspondientes. El pago se
              procesa a través de Mercado Pago, con los medios de pago que esa plataforma tenga disponibles al momento de
              tu compra.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal">Entrega</h2>
            <p className="mt-2">
              Una vez que Mercado Pago confirma tu pago, te enviamos un correo con los PDF correspondientes a tu compra.
              Normalmente llega en minutos. Si no te llega, escribinos desde el formulario de contacto y te lo
              reenviamos: tu compra queda registrada con el email que usaste al pagar.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal">Uso permitido de los libros</h2>
            <p className="mt-2">
              Podés imprimir los libros que compraste todas las veces que quieras, para uso personal y familiar. Lo que no
              está permitido es revender, redistribuir o compartir públicamente los archivos PDF (por ejemplo, subirlos a
              internet para que otras personas los descarguen gratis). El contenido es original de NGM Studio.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal">Cambios, devoluciones y soporte</h2>
            <p className="mt-2">
              Al ser un producto digital de entrega inmediata, no aplican devoluciones una vez descargado el material.
              Dicho esto, si tenés cualquier problema para acceder a tus PDF —no te llegó el correo, el archivo está
              dañado, compraste dos veces por error— escribinos y lo solucionamos. Nuestra prioridad es que puedas
              disfrutar lo que compraste.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal">Cambios en estos términos</h2>
            <p className="mt-2">
              Podemos actualizar estos términos en el futuro. Si lo hacemos, vamos a actualizar la fecha en esta misma
              página.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold text-charcoal">Contacto</h2>
            <p className="mt-2">
              Para cualquier consulta sobre tu compra, usá el formulario de contacto de la tienda.
            </p>
          </section>

          <p className="mt-4 rounded-2xl bg-white/60 p-4 text-xs text-charcoal/45">
            Este texto es una guía general redactada para una tienda pequeña y no reemplaza el asesoramiento de un
            abogado. Si necesitás términos y condiciones con validez legal específica para tu situación, te recomendamos
            consultar con un profesional.
          </p>
        </div>
      </main>

      <footer className="border-t border-charcoal/10 px-6 py-8 text-center">
        <a href={STORE_URL} className="font-serif text-sm font-semibold text-charcoal/50 hover:text-charcoal">‹ Volver a Mundo de Colores</a>
      </footer>
    </div>
  )
}
