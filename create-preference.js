const PRODUCTS = {
  'NGM-MDC-001': { title: 'Dinosaurios para Colorear', price: 4900 },
  'NGM-MDC-002': { title: 'Animales de la Granja', price: 4900 },
  'NGM-MDC-006': { title: 'Navidad para Colorear', price: 4900 },
  'NGM-MDC-007': { title: 'Las Estaciones del Año', price: 4900 },
  // Solo se habilitan productos cuyo PDF final ya está listo para entregar.
}

function cleanText(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function requestOrigin(req) {
  const forwardedHost = req.headers['x-forwarded-host']
  const host = cleanText(Array.isArray(forwardedHost) ? forwardedHost[0] : forwardedHost, 255)
    || cleanText(req.headers.host, 255)
  const protocol = host.includes('localhost') ? 'http' : 'https'
  return `${protocol}://${host}`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Método no permitido.' })
  }

  const accessToken = process.env.MP_ACCESS_TOKEN
  if (!accessToken) return res.status(500).json({ error: 'Mercado Pago todavía no está configurado.' })

  const name = cleanText(req.body?.name, 100)
  const email = cleanText(req.body?.email, 160).toLowerCase()
  const productCode = cleanText(req.body?.productCode, 30)
  const product = PRODUCTS[productCode]

  if (!name || !validEmail(email) || !product) {
    return res.status(400).json({ error: 'Revisá el nombre, el correo y el producto.' })
  }

  const orderId = `MDC-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`
  const origin = requestOrigin(req)
  const preferenceBody = {
    items: [{
      id: productCode,
      title: product.title,
      description: 'Producto digital PDF',
      category_id: 'books',
      currency_id: 'ARS',
      quantity: 1,
      unit_price: product.price,
    }],
    payer: { name, email },
    external_reference: orderId,
    metadata: {
      order_id: orderId,
      customer_name: name,
      delivery_email: email,
      product_code: productCode,
    },
    back_urls: {
      success: `${origin}/pago-aprobado`,
      pending: `${origin}/pago-pendiente`,
      failure: `${origin}/pago-rechazado`,
    },
    auto_return: 'approved',
  }

  try {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': orderId,
      },
      body: JSON.stringify(preferenceBody),
    })
    const data = await response.json()

    if (!response.ok || !data.id) {
      console.error('Mercado Pago preference error', response.status, data?.message)
      return res.status(502).json({ error: 'Mercado Pago no pudo iniciar el cobro. Intentá nuevamente.' })
    }

    return res.status(200).json({
      preferenceId: data.id,
      checkoutUrl: data.sandbox_init_point || data.init_point,
      orderId,
    })
  } catch (error) {
    console.error('Mercado Pago connection error', error)
    return res.status(502).json({ error: 'No pudimos conectar con Mercado Pago. Intentá nuevamente.' })
  }
}
