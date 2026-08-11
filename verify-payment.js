const PRODUCTS = {
  'NGM-MDC-001': { price: 4900, title: 'Dinosaurios para Colorear' },
  'NGM-MDC-002': { price: 4900, title: 'Animales de la Granja' },
  'NGM-MDC-006': { price: 4900, title: 'Navidad para Colorear' },
  'NGM-MDC-007': { price: 4900, title: 'Las Estaciones del Año' },
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
    const product = PRODUCTS[String(payment.metadata?.product_code || '')]
    const isApproved = response.ok
      && payment.status === 'approved'
      && product
      && Number(payment.transaction_amount) === product.price
      && String(payment.external_reference || '').startsWith('MDC-')

    return res.status(200).json({
      approved: isApproved,
      status: payment.status || 'unknown',
      product: isApproved ? product.title : undefined,
    })
  } catch (error) {
    console.error('Payment verification error', error)
    return res.status(502).json({ error: 'No pudimos verificar tu pago. Intentá nuevamente en unos segundos.' })
  }
}
