import crypto from 'node:crypto'

const PRODUCTS = {
  'NGM-MDC-001': { title: 'Dinosaurios para Colorear', price: 4900 },
  'NGM-MDC-002': { title: 'Animales de la Granja', price: 4900 },
  'NGM-MDC-003': { title: 'Mundo Marino', price: 4900 },
  'NGM-MDC-004': { title: 'Vehículos para Colorear', price: 4900 },
  'NGM-MDC-005': { title: 'Unicornios para Colorear', price: 4900 },
  'NGM-MDC-006': { title: 'Navidad para Colorear', price: 4900 },
  'NGM-MDC-007': { title: 'Las Estaciones del Año', price: 4900 },
}

const PACKS = {
  'PACK3': { title: 'Pack 3 Libros', price: 11900 },
  'FULL7': { title: 'Colección Completa', price: 24900 },
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

function resolveOrder(productCode, selectedCodes) {
  const pack = PACKS[productCode]
  if (pack) {
    const codes = Array.isArray(selectedCodes) ? selectedCodes.filter(code => PRODUCTS[code]) : []
    if (!codes.length) return null
    return { title: pack.title, price: pack.price, codes }
  }
  const single = PRODUCTS[productCode]
  if (!single) return null
  return { title: single.title, price: single.price, codes: [productCode] }
}

function signedDownloadUrl(origin, paymentId, bookCode) {
  const params = new URLSearchParams({
    payment_id: String(paymentId),
    book_code: bookCode,
  })
  return `${origin}/api/download-book?${params.toString()}`
}

async function sendDeliveryEmail({ apiKey, from, to, customerName, order, downloadLinks, paymentId }) {
  const safeName = escapeHtml(customerName)
  const safeProduct = escapeHtml(order.title)
  const buttons = downloadLinks.map(link => `<p style="margin:14px 0"><a href="${link.url}" style="display:inline-block;background:#e57832;color:#ffffff;text-decoration:none;border-radius:10px;padding:14px 22px;font-weight:700">Descargar ${escapeHtml(link.title)}</a></p>`).join('')
  const html = `<!doctype html>
<html lang="es"><body style="margin:0;background:#fff7ed;font-family:Arial,sans-serif;color:#3f2d20">
  <div style="max-width:600px;margin:0 auto;padding:32px 20px">
    <div style="background:#ffffff;border-radius:20px;padding:32px;text-align:center;box-shadow:0 4px 18px rgba(75,45,25,.10)">
      <p style="margin:0 0 12px;color:#e57832;font-weight:700">MUNDO DE COLORES</p>
      <h1 style="margin:0 0 16px;font-size:28px">¡Tu compra está lista!</h1>
      <p style="font-size:16px;line-height:1.6">Hola ${safeName}, gracias por tu compra de <strong>${safeProduct}</strong>.</p>
      ${buttons}
      <p style="font-size:13px;line-height:1.5;color:#705c4e">Guardá los PDF una vez descargados.</p>
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
      subject: `Tu compra está lista: ${order.title}`,
      html,
      text: `Hola ${customerName}. Tu compra de ${order.title} está lista. Descargá desde: ${downloadLinks.map(l => l.url).join(', ')}`,
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
  const emailFrom = process.env.EMAIL_FROM || 'Mundo de Colores <onboarding@resend.dev>'

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
    const selectedCodes = String(payment.metadata?.selected_codes || '').split(',').filter(Boolean)
    const order = resolveOrder(productCode, selectedCodes)
    const paidAmount = Number(payment.transaction_amount)
    const orderId = String(payment.metadata?.order_id || payment.external_reference || '')
    const deliveryEmail = String(payment.metadata?.delivery_email || payment.payer?.email || '')

    if (
      !orderId.startsWith('MDC-')
      || !deliveryEmail
      || !order
      || paidAmount !== order.price
    ) {
      console.error('Approved payment failed order validation', {
        paymentId: String(payment.id),
        orderId,
        productCode,
        paidAmount,
      })
      return res.status(200).json({ received: true, approved: false, validation: 'failed' })
    }

    if (!resendApiKey) {
      console.warn('Resend not configured, skipping backup email')
      return res.status(200).json({ received: true, approved: true, emailSkipped: true })
    }

    const origin = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers['x-forwarded-host'] || req.headers.host}`
    const downloadLinks = order.codes.map(code => ({
      title: PRODUCTS[code]?.title || code,
      url: signedDownloadUrl(origin, payment.id, code),
    }))

    await sendDeliveryEmail({
      apiKey: resendApiKey,
      from: emailFrom,
      to: deliveryEmail,
      customerName: String(payment.metadata?.customer_name || 'amiga/o'),
      order,
      downloadLinks,
      paymentId: payment.id,
    })

    return res.status(200).json({ received: true, approved: true })
  } catch (error) {
    console.error('Mercado Pago webhook verification error', error)
    return res.status(500).json({ error: 'No se pudo procesar la notificación.' })
  }
}
