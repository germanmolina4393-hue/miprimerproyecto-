import { Readable } from 'node:stream'
import { get } from '@vercel/blob'
import crypto from 'node:crypto'

const PRODUCTS = {
  'NGM-MDC-001': { file: 'NGM-MDC-001-dinosaurios-para-colorear.pdf', name: 'Dinosaurios_para_Colorear_NGM-MDC-001.pdf' },
  'NGM-MDC-002': { file: 'Animales_de_la_Granja_para_Colorear_NGM-MDC-002.pdf', name: 'Animales_de_la_Granja_NGM-MDC-002.pdf' },
  'NGM-MDC-003': { file: 'Mundo_Marino_para_Colorear_NGM-MDC-003.pdf', name: 'Mundo_Marino_NGM-MDC-003.pdf' },
  'NGM-MDC-004': { file: 'Vehiculos_para_Colorear_NGM-MDC-004_optimizado.pdf', name: 'Vehiculos_para_Colorear_NGM-MDC-004.pdf' },
  'NGM-MDC-005': { file: 'Unicornios_para_Colorear_NGM-MDC-005_optimizado.pdf', name: 'Unicornios_para_Colorear_NGM-MDC-005.pdf' },
  'NGM-MDC-006': { file: 'Navidad_para_Colorear_NGM-MDC-006_optimizado.pdf', name: 'Navidad_para_Colorear_NGM-MDC-006.pdf' },
  'NGM-MDC-007': { file: 'Las_Estaciones_del_Ano_para_Colorear_NGM-MDC-007_optimizado.pdf', name: 'Las_Estaciones_del_Ano_NGM-MDC-007.pdf' },
}

const PACKS = {
  'PACK3': { price: 11900, count: 3 },
  'FULL7': { price: 24900, count: 7 },
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Método no permitido.' })
  }
  const paymentId = String(req.query?.payment_id || '').trim()
  const bookCode = String(req.query?.book_code || '').trim()
  const accessToken = process.env.MP_ACCESS_TOKEN
  const deliveryLinkSecret = process.env.DELIVERY_LINK_SECRET
  const expiresAt = String(req.query?.expires_at || '').trim()
  const signature = String(req.query?.signature || '').trim()
  if (!paymentId || !accessToken || !deliveryLinkSecret) return res.status(400).json({ error: 'No pudimos identificar tu pago.' })
  if (!validDownloadSignature(paymentId, expiresAt, signature, deliveryLinkSecret)) {
    return res.status(403).json({ error: 'Este enlace de descarga venció o no es válido.' })
  }

  const product = PRODUCTS[bookCode]
  if (!product) return res.status(400).json({ error: 'Libro no reconocido.' })

  try {
    const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const payment = await paymentResponse.json()
    const productCode = payment.metadata?.product_code
    const selectedCodes = String(payment.metadata?.selected_codes || '').split(',').filter(Boolean)
    const pack = PACKS[productCode]

    let expectedPrice = null
    let allowedCodes = []

    if (pack) {
      expectedPrice = pack.price
      allowedCodes = selectedCodes
    } else if (PRODUCTS[productCode]) {
      expectedPrice = 4900
      allowedCodes = [productCode]
    }

    const validPurchase = paymentResponse.ok
      && payment.status === 'approved'
      && expectedPrice !== null
      && allowedCodes.includes(bookCode)
      && Number(payment.transaction_amount) === expectedPrice
      && String(payment.external_reference || '').startsWith('MDC-')

    if (!validPurchase) return res.status(403).json({ error: 'Este pago no habilita la descarga.' })

    const bookPath = `mundo-de-colores/${product.file}`
    const blob = await get(bookPath, { access: 'private' })
    if (!blob || blob.statusCode !== 200 || !blob.stream) {
      console.error('Protected book file was not found', bookPath)
      return res.status(503).json({ error: 'El libro se está preparando. Volvé a intentar en unos minutos.' })
    }
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Length', String(blob.blob.size))
    res.setHeader('Content-Disposition', `attachment; filename="${product.name}"`)
    res.setHeader('Cache-Control', 'private, no-store')
    Readable.fromWeb(blob.stream).pipe(res)
  } catch (error) {
    console.error('Protected download error', error)
    return res.status(502).json({ error: 'No pudimos preparar la descarga. Intentá nuevamente.' })
  }
}
