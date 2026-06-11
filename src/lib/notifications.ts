interface OrderData {
  id: string
  total: number
}

export async function sendOrderConfirmation(telefono: string, orderData: OrderData): Promise<void> {
  const refCorta = orderData.id.slice(0, 8).toUpperCase()
  const mensaje =
    `MercaOnline ✓ Pedido confirmado. Tu género llegará antes de las 7AM. ` +
    `Total: ${orderData.total.toFixed(2)}€. Ref: #${refCorta}`

  if (import.meta.env.DEV) {
    console.log(`[SMS → ${telefono}] ${mensaje}`)
    return
  }

  // Production: Supabase Edge Function que llama a Twilio
  await fetch('/api/confirm-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telefono, mensaje }),
  })
}
