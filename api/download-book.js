import { Readable } from 'node:stream'
import { get } from '@vercel/blob'

const PRODUCTS = {
  'NGM-MDC-001': { price: 4900, file: 'NGM-MDC-001-dinosaurios-para-colorear.pdf', name: 'Dinosaurios_para_Colorear_NGM-MDC-001.pdf' },
  'NGM-MDC-002': { price: 4900, file: 'Animales_de_la_Granja_para_Colorear_NGM-MDC-002.pdf', name: 'Animales_de_la_Granja_NGM-MDC-002.pdf' },
  'NGM-MDC-003': { price: 4900, file: 'Mundo_Marino_para_Colorear_NGM-MDC-003.pdf', name: 'Mundo_Marino_NGM-MDC-003.pdf' },
  'NGM-MDC-004': { price: 4900, file: 'Vehiculos_para_Colorear_NGM-MDC-004_optimizado.pdf', name: 'Vehiculos_para_Colorear_NGM-MDC-004.pdf' },
  'NGM-MDC-005': { price: 4900, file: 'Unicornios_para_Colorear_NGM-MDC-005_optimizado.pdf', name: 'Unicornios_para_Colorear_NGM-MDC-005.pdf' },
  'NGM-MDC-006': { price: 4900, file: 'Navidad_para_Colorear_NGM-MDC-006_optimizado.pdf', name: 'Navidad_para_Colorear_NGM-MDC-006.pdf' },
  'NGM-MDC-007': { price: 4900, file: 'Las_Estaciones_del_Ano_para_Colorear_NGM-MDC-007_optimizado.pdf', name: 'Las_Estaciones_del_Ano_NGM-MDC-007.pdf' },
}

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
    const productCode = payment.metadata?.product_code
    const product = PRODUCTS[productCode]
    const validPurchase = paymentResponse.ok
      && payment.status === 'approved'
      && !!product
      && Number(payment.transaction_amount) === product.price
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
