interface CheckoutRequest {
  name: string
  email: string
  productCode: string
  selectedCodes?: string[]
}

interface CheckoutResponse {
  checkoutUrl?: string
  error?: string
}

export async function createCheckout(request: CheckoutRequest) {
  const response = await fetch('/api/create-preference', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  const data = await response.json() as CheckoutResponse

  if (!response.ok || !data.checkoutUrl) {
    throw new Error(data.error || 'No pudimos iniciar el pago.')
  }

  window.location.assign(data.checkoutUrl)
}
