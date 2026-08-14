import { Readable } from 'node:stream'
import { get } from '@vercel/blob'
import crypto from 'node:crypto'

const PRODUCTS = {
  'NGM-MDC-001': {
    price: 4900,
    path: 'mundo-de-colores/NGM-MDC-001-dinosaurios-para-colorear.pdf',
    filename: 'Dinosaurios_para_Colorear_NGM-MDC-001.pdf',
  },
  'NGM-MDC-002': {
    price: 4900,
    path: 'mundo-de-colores/Animales_de_la_Granja_para_Colorear_NGM-MDC-002.pdf',
    filename: 'Animales_de_la_Granja_para_Colorear_NGM-MDC-002.pdf',
  },
  'NGM-MDC-006': {
    price: 4900,
    path: 'mundo-de-colores/Navidad_para_Colorear_NGM-MDC-006_optimizado.pdf',
    filename: 'Navidad_para_Colorear_NGM-MDC-006_optimizado.pdf',
  },
  'NGM-MDC-007': {
    price: 4900,
    path: 'mundo-de-colores/Las_Estaciones_del_Ano_para_Colorear_NGM-MDC-007_optimizado.pdf',
    filename: 'Las_Estaciones_del_Ano_para_Colorear_NGM-MDC-007_optimizado.pdf',
  },
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left || '', 'utf8')
  const rightBuffer = Buffer.from(right || '', 'utf8')
  return leftBuffer.length === rightBuffer.length
    && crypto.timingSafeEqual(leftBuffer, rightBuffer)
}

function validDownloadSignature(paymentId, expiresAt, signature, secret) {
  const expiry = Number(expiresAt)
  if (!paymentId || !Number.isSafeInteger(expiry) || expiry <= Math.floor(Date.now() / 1000)) return false
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${paymentId}.${expiry}`)
    .digest('base64url')
  return safeEqual(expected, signature)
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Método no permitido.' })
  }

  const paymentId = String(req.query?.payment_id || '').trim()
  const accessToken = process.env.MP_ACCESS_TOKEN
  const deliveryLinkSecret = process.env.DELIVERY_LINK_SECRET
  const expiresAt = String(req.query?.expires_at || '').trim()
  const signature = String(req.query?.signature || '').trim()
  if (!paymentId || !accessToken || !deliveryLinkSecret) return res.status(400).json({ error: 'No pudimos identificar tu pago.' })
  if (!validDownloadSignature(paymentId, expiresAt, signature, deliveryLinkSecret)) {
    return res.status(403).json({ error: 'Este enlace de descarga venció o no es válido.' })
  }

  try {
    const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const payment = await paymentResponse.json()
    const productCode = String(payment.metadata?.product_code || '')
    const product = PRODUCTS[productCode]
    const validPurchase = paymentResponse.ok
      && payment.status === 'approved'
      && product
      && Number(payment.transaction_amount) === product.price
      && String(payment.external_reference || '').startsWith('MDC-')

    if (!validPurchase) return res.status(403).json({ error: 'Este pago no habilita la descarga.' })

    const blob = await get(product.path, { access: 'private' })
    if (!blob || blob.statusCode !== 200 || !blob.stream) {
      console.error('Protected book file was not found', product.path)
      return res.status(503).json({ error: 'El libro se está preparando. Volvé a intentar en unos minutos.' })
    }

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Length', String(blob.blob.size))
    res.setHeader('Content-Disposition', `attachment; filename="${product.filename}"`)
    res.setHeader('Cache-Control', 'private, no-store')
    Readable.fromWeb(blob.stream).pipe(res)
  } catch (error) {
    console.error('Protected download error', error)
    return res.status(502).json({ error: 'No pudimos preparar la descarga. Intentá nuevamente.' })
  }
}
