import { useEffect, useState } from 'react'
import { CheckCircle2, Download, LoaderCircle, TriangleAlert } from 'lucide-react'
type State = 'checking' | 'approved' | 'pending' | 'rejected' | 'error'
interface Item { code: string; title: string }
export default function PaymentResult() {
  const params = new URLSearchParams(window.location.search)
  const paymentId = params.get('payment_id') || params.get('collection_id')
  const [state, setState] = useState<State>(paymentId ? 'checking' : 'error')
  const [message, setMessage] = useState(paymentId ? 'Estamos verificando tu pago con Mercado Pago…' : 'No encontramos el identificador del pago. Si se acreditó, escribinos y lo revisamos.')
  const [items, setItems] = useState<Item[]>([])
  useEffect(() => {
    if (!paymentId) return
    fetch(`/api/verify-payment?payment_id=${encodeURIComponent(paymentId)}`)
      .then(async response => ({ response, data: await response.json() }))
      .then(({ response, data }) => {
        if (!response.ok) throw new Error(data.error)
        if (data.approved) {
          setState('approved')
          const count = Array.isArray(data.items) ? data.items.length : 1
          setMessage(count > 1 ? `¡Tu pago fue aprobado! Ya podés descargar tus ${count} libros.` : '¡Tu pago fue aprobado! Ya podés descargar tu libro.')
          setItems(Array.isArray(data.items) ? data.items : [])
        } else if (data.status === 'pending' || data.status === 'in_process') {
          setState('pending')
          setMessage('Tu pago todavía está pendiente. Cuando Mercado Pago lo apruebe, volvé a abrir este enlace.')
        } else {
          setState('rejected')
          setMessage('El pago no fue aprobado. Podés volver a intentarlo desde la tienda.')
        }
      })
      .catch(error => {
        setState('error')
        setMessage(error instanceof Error && error.message ? error.message : 'No pudimos verificar el pago. Intentá nuevamente en unos segundos.')
      })
  }, [paymentId])
  const isChecking = state === 'checking'
  const isApproved = state === 'approved'
  return (
    <main className="flex min-h-screen items-center justify-center bg-parchment px-5 py-12">
      <section className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-xl sm:p-12">
        {isChecking ? <LoaderCircle className="mx-auto animate-spin text-gold" size={48} /> : isApproved ? <CheckCircle2 className="mx-auto text-sage" size={52} /> : <TriangleAlert className="mx-auto text-gold" size={52} />}
        <p className="mt-6 text-xs font-bold uppercase tracking-wider text-gold">Mundo de Colores · NGM Studio</p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-charcoal">{isApproved ? '¡Gracias por tu compra!' : 'Estado de tu pago'}</h1>
        <p className="mt-4 leading-relaxed text-charcoal/60">{message}</p>
        {isApproved && paymentId && (
          <div className="mt-8 flex flex-col gap-3">
            {items.map(item => (
              
                key={item.code}
                href={`/api/download-book?payment_id=${encodeURIComponent(paymentId)}&book_code=${encodeURIComponent(item.code)}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-charcoal px-6 py-4 font-semibold text-parchment transition-colors hover:bg-gold"
              >
                <Download size={18} /> Descargar {item.title}
              </a>
            ))}
          </div>
        )}
        {isApproved && <a href="/" className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-charcoal/15 px-6 py-3.5 text-sm font-semibold text-charcoal transition-colors hover:bg-charcoal/5">Volver a la página principal</a>}
        {!isChecking && !isApproved && <a href="/" className="mt-8 inline-flex rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-parchment transition-colors hover:bg-gold">Volver a la tienda</a>}
      </section>
    </main>
  )
}
