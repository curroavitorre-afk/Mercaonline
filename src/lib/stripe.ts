import { loadStripe } from '@stripe/stripe-js'

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string

export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)

// Simulates the server-side charge — in production this calls a Supabase Edge Function:
// POST /functions/v1/create-payment-intent { paymentMethodId, amount }
export async function simulateCharge(paymentMethodId: string, _amountCentimos: number): Promise<void> {
  void paymentMethodId
  await new Promise<void>((r) => setTimeout(r, 800))
}
