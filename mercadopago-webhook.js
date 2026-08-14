import crypto from 'node:crypto'

const EXPECTED_PRICES = {
  'NGM-MDC-001': 4900,
  'NGM-MDC-002': 4900,
  'NGM-MDC-006': 4900,
  'NGM-MDC-007': 4900,
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

function escapeHtml(value) {
  return String(value || '').replace(/[&<>'"]/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  }[character]))
}

function signedDownloadUrl(origin, paymentId, secret) {
  const expiresAt = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${paymentId}.${expiresAt}`)
    .digest('base64url')

  const params = new URLSearchParams({
    payment_id: String(paymentId),
    expires_at: String(expiresAt),
    signature,
  })
  return `${origin}/api/download-book?${params.toString()}`
}

async function sendDeliveryEmail({ apiKey, from, to, customerName, productName, downloadUrl, paymentId }) {
  const safeName = escapeHtml(customerName)
  const safeProduct = escapeHtml(productName)
  const html = `<!doctype html>
<html lang="es"><body style="margin:0;background:#fff7ed;font-family:Arial,sans-serif;color:#3f2d20">
  <div style="max-width:600px;margin:0 auto;padding:32px 20px">
    <div style="background:#ffffff;border-radius:20px;padding:32px;text-align:center;box-shadow:0 4px 18px rgba(75,45,25,.10)">
      <p style="margin:0 0 12px;color:#e57832;font-weight:700">MUNDO DE COLORES</p>
      <h1 style="margin:0 0 16px;font-size:28px">¡Tu libro está listo!</h1>
      <p style="font-size:16px;line-height:1.6">Hola ${safeName}, gracias por tu compra. Ya podés descargar <strong>${safeProduct}</strong>.</p>
      <p style="margin:28px 0"><a href="${downloadUrl}" style="display:inline-block;background:#e57832;color:#ffffff;text-decoration:none;border-radius:10px;padding:14px 22px;font-weight:700">Descargar mi libro</a></p>
      <p style="font-size:13px;line-height:1.5;color:#705c4e">Por seguridad, este enlace vence en 7 días. Guardá el PDF una vez descargado.</p>
    </div>
  </div>
</body></html>`

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `mundo-de-colores/delivery/${paymentId}`,
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Tu compra está lista: ${productName}`,
      html,
      text: `Hola ${customerName}. Tu compra de ${productName} está lista. Descargala aquí: ${downloadUrl} Este enlace vence en 7 días.`,
      tags: [
        { name: 'type', value: 'digital-delivery' },
        { name: 'payment_id', value: String(paymentId).slice(0, 256) },
      ],
    }),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(`Resend email error ${response.status}: ${data?.message || 'unknown'}`)
  return data
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Método no permitido.' })
  }

  const accessToken = process.env.MP_ACCESS_TOKEN
  const webhookSecret = process.env.MP_WEBHOOK_SECRET
  const resendApiKey = process.env.RESEND_API_KEY
  const deliveryLinkSecret = process.env.DELIVERY_LINK_SECRET
  const emailFrom = process.env.EMAIL_FROM || 'Mundo de Colores <onboarding@resend.dev>'

  if (!accessToken || !webhookSecret || !resendApiKey || !deliveryLinkSecret) {
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

    const origin = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers['x-forwarded-host'] || req.headers.host}`
    const productName = {
      'NGM-MDC-001': 'Dinosaurios para Colorear',
      'NGM-MDC-002': 'Animales de la Granja',
      'NGM-MDC-006': 'Navidad para Colorear',
      'NGM-MDC-007': 'Las Estaciones del Año',
    }[productCode]

    await sendDeliveryEmail({
      apiKey: resendApiKey,
      from: emailFrom,
      to: deliveryEmail,
      customerName: String(payment.metadata?.customer_name || 'amiga/o'),
      productName,
      downloadUrl: signedDownloadUrl(origin, payment.id, deliveryLinkSecret),
      paymentId: payment.id,
    })

    return res.status(200).json({ received: true, approved: true })
  } catch (error) {
    console.error('Mercado Pago webhook verification error', error)
    return res.status(500).json({ error: 'No se pudo procesar la notificación.' })
  }
}
