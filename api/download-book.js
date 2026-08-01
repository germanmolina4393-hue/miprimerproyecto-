import { Readable } from 'node:stream'
import { get } from '@vercel/blob'

const PRODUCT = { code: 'NGM-MDC-001', price: 4900 }
const BOOK_PATH = 'mundo-de-colores/NGM-MDC-001-dinosaurios-para-colorear.pdf'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Método no permitido.' })
  }

  const paymentId = String(req.query?.payment_id || '').trim()
  const accessToken = process.env.MP_ACCESS_TOKEN
  if (!paymentId || !accessToken) return res.status(400).json({ error: 'No pudimos identificar tu pago.' })

  try {
    const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const payment = await paymentResponse.json()
    const validPurchase = paymentResponse.ok
      && payment.status === 'approved'
      && payment.metadata?.product_code === PRODUCT.code
      && Number(payment.transaction_amount) === PRODUCT.price
      && String(payment.external_reference || '').startsWith('MDC-')

    if (!validPurchase) return res.status(403).json({ error: 'Este pago no habilita la descarga.' })

    const blob = await get(BOOK_PATH, { access: 'private' })
    if (!blob || blob.statusCode !== 200 || !blob.stream) {
      console.error('Protected book file was not found', BOOK_PATH)
      return res.status(503).json({ error: 'El libro se está preparando. Volvé a intentar en unos minutos.' })
    }

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Length', String(blob.blob.size))
    res.setHeader('Content-Disposition', 'attachment; filename="Dinosaurios_para_Colorear_NGM-MDC-001.pdf"')
    res.setHeader('Cache-Control', 'private, no-store')
    Readable.fromWeb(blob.stream).pipe(res)
  } catch (error) {
    console.error('Protected download error', error)
    return res.status(502).json({ error: 'No pudimos preparar la descarga. Intentá nuevamente.' })
  }
}
