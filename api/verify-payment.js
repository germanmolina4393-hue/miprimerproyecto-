const PRODUCTS = {
  'NGM-MDC-001': { title: 'Dinosaurios para Colorear' },
  'NGM-MDC-002': { title: 'Animales de la Granja' },
  'NGM-MDC-003': { title: 'Mundo Marino' },
  'NGM-MDC-004': { title: 'Vehículos para Colorear' },
  'NGM-MDC-005': { title: 'Unicornios para Colorear' },
  'NGM-MDC-006': { title: 'Navidad para Colorear' },
  'NGM-MDC-007': { title: 'Las Estaciones del Año' },
}

const PACKS = {
  'PACK3': { title: 'Pack 3 Libros', price: 11900, count: 3 },
  'FULL7': { title: 'Colección Completa', price: 24900, count: 7 },
}

function paymentIdFrom(req) {
  return String(req.query?.payment_id || req.query?.collection_id || '').trim()
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Método no permitido.' })
  }
  const paymentId = paymentIdFrom(req)
  const accessToken = process.env.MP_ACCESS_TOKEN
  if (!paymentId || !accessToken) return res.status(400).json({ error: 'No pudimos identificar tu pago.' })
  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const payment = await response.json()
    const productCode = payment.metadata?.product_code
    const selectedCodes = String(payment.metadata?.selected_codes || '').split(',').filter(Boolean)
    const pack = PACKS[productCode]
    const singleProduct = PRODUCTS[productCode]

    let expectedPrice = null
    let items = []

    if (pack) {
      expectedPrice = pack.price
      items = selectedCodes.filter(code => PRODUCTS[code]).map(code => ({ code, title: PRODUCTS[code].title }))
    } else if (singleProduct) {
      expectedPrice = 4900
      items = [{ code: productCode, title: singleProduct.title }]
    }

    const isApproved = response.ok
      && payment.status === 'approved'
      && expectedPrice !== null
      && items.length > 0
      && Number(payment.transaction_amount) === expectedPrice
      && String(payment.external_reference || '').startsWith('MDC-')

    return res.status(200).json({
      approved: isApproved,
      status: payment.status || 'unknown',
      product: isApproved && !pack ? items[0]?.title : undefined,
      items: isApproved ? items : undefined,
      isPack: isApproved ? !!pack : undefined,
    })
  } catch (error) {
    console.error('Payment verification error', error)
    return res.status(502).json({ error: 'No pudimos verificar tu pago. Intentá nuevamente en unos segundos.' })
  }
}
