import crypto from 'node:crypto'

const EXPECTED_PRICES = {
  'NGM-MDC-001': 4900,
  'NGM-MDC-002': 4900,
  'NGM-MDC-003': 4900,
  'NGM-MDC-004': 4900,
  'NGM-MDC-005': 4900,
  'NGM-MDC-006': 4900,
  'NGM-MDC-007': 4900,
  PACK3: 11900,
  COLLECTION: 24900,
}

function firstHeader(value) {
  return Array.isArray(value) ? value[0] : value
}

function signatureParts(header) {
  return String(header || '')
    .split(',')
    .map(part => part.trim().split('='))
    .reduce((parts, [key, value]) => {
      if (key && value) parts[key] = value
      return parts
    }, {})
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left || '', 'utf8')
  const rightBuffer = Buffer.from(right || '', 'utf8')
  return leftBuffer.length === rightBuffer.length
    && crypto.timingSafeEqual(leftBuffer, rightBuffer)
}

function paymentIdFrom(req) {
  const queryId = req.query?.['data.id'] ?? req.query?.id
  const bodyId = req.body?.data?.id ?? req.body?.id
  return String(queryId ?? bodyId ?? '').trim()
}

function notificationTypeFrom(req) {
  return String(req.query?.type ?? req.body?.type ?? req.body?.topic ?? '').trim()
}

function validSignature(req, paymentId, secret) {
  const xSignature = firstHeader(req.headers['x-signature'])
  const xRequestId = firstHeader(req.headers['x-request-id'])
  const { ts, v1 } = signatureParts(xSignature)

  if (!paymentId || !xRequestId || !ts || !v1) return false

  const manifest = `id:${paymentId};request-id:${xRequestId};ts:${ts};`
  const expected = crypto
    .createHmac('sha256', secret)
    .update(manifest)
    .digest('hex')

  return safeEqual(expected, v1)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Método no permitido.' })
  }

  const accessToken = process.env.MP_ACCESS_TOKEN
  const webhookSecret = process.env.MP_WEBHOOK_SECRET

  if (!accessToken || !webhookSecret) {
    console.error('Mercado Pago webhook is missing server configuration')
    return res.status(503).json({ error: 'Webhook todavía no configurado.' })
  }

  const paymentId = paymentIdFrom(req)
  const notificationType = notificationTypeFrom(req)

  if (notificationType && notificationType !== 'payment') {
    return res.status(200).json({ received: true, ignored: notificationType })
  }

  if (!validSignature(req, paymentId, webhookSecret)) {
    console.warn('Mercado Pago webhook rejected an invalid signature')
    return res.status(401).json({ error: 'Firma inválida.' })
  }

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(paymentId)}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (response.status === 404) {
      // La simulación oficial puede usar un identificador que no representa
      // un pago real. La firma ya fue validada, por lo que confirmamos recepción.
      return res.status(200).json({ received: true, simulated: true })
    }

    const payment = await response.json()

    if (!response.ok) {
      console.error('Mercado Pago payment lookup failed', response.status, payment?.message)
      return res.status(500).json({ error: 'No se pudo verificar el pago.' })
    }

    if (payment.status !== 'approved') {
      return res.status(200).json({
        received: true,
        approved: false,
        status: payment.status,
      })
    }

    const productCode = String(payment.metadata?.product_code || '')
    const expectedPrice = EXPECTED_PRICES[productCode]
    const paidAmount = Number(payment.transaction_amount)
    const orderId = String(payment.metadata?.order_id || payment.external_reference || '')
    const deliveryEmail = String(payment.metadata?.delivery_email || payment.payer?.email || '')

    if (
      !orderId.startsWith('MDC-')
      || !deliveryEmail
      || !expectedPrice
      || paidAmount !== expectedPrice
    ) {
      console.error('Approved payment failed order validation', {
        paymentId: String(payment.id),
        orderId,
        productCode,
        paidAmount,
      })
      return res.status(200).json({ received: true, approved: false, validation: 'failed' })
    }

    // En el próximo paso se conectará aquí el correo y el enlace privado.
    // Por ahora solo se registra un pago aprobado y verificado.
    console.info('Mundo de Colores payment approved', {
      paymentId: String(payment.id),
      orderId,
      productCode,
      deliveryEmail,
      selectedCodes: payment.metadata?.selected_codes || [],
    })

    return res.status(200).json({ received: true, approved: true })
  } catch (error) {
    console.error('Mercado Pago webhook verification error', error)
    return res.status(500).json({ error: 'No se pudo procesar la notificación.' })
  }
}
