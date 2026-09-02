import Stripe from 'stripe'

// Stripe client singleton with build-time safe fallback
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || 'sk_live_placeholder_for_build',
  {
    apiVersion: '2026-08-26.dahlia',
  }
)

/**
 * Auto-creates LajuS Pro products & prices in Stripe if they do not exist yet.
 * Called once during first API request. Price IDs cached in process.env.
 */
export async function ensureStripeProducts(): Promise<{
  monthlyPriceId: string
  yearlyPriceId: string
}> {
  if (
    process.env.STRIPE_PRICE_MONTHLY &&
    process.env.STRIPE_PRICE_YEARLY
  ) {
    return {
      monthlyPriceId: process.env.STRIPE_PRICE_MONTHLY,
      yearlyPriceId: process.env.STRIPE_PRICE_YEARLY,
    }
  }

  // 1. Find or create the main product
  let product: Stripe.Product | null = null
  const productList = await stripe.products.list({ active: true, limit: 100 })
  const foundProduct = productList.data.find(
    (p) => p.name === 'LajuS Pro' || p.name === 'LajuS Loyalty' || p.metadata?.app === 'lajus'
  )

  if (foundProduct) {
    product = foundProduct
    console.log('[Stripe Setup] Found existing product:', product.id)
  } else {
    product = await stripe.products.create({
      name: 'LajuS Pro',
      description:
        'Pelan Pro LajuS - Sistem Loyalty Stamp Digital tanpa had pelanggan, QR resit, Bluetooth print, analitik & log aktiviti.',
      metadata: { app: 'lajus', tier: 'pro' },
    })
    console.log('[Stripe Setup] Created new product:', product.id)
  }

  const allPrices = await stripe.prices.list({ product: product.id, active: true, limit: 50 })

  // 2. Pro Monthly Price (RM 53 = 5300 cents / month)
  let monthlyPrice: Stripe.Price | null = null
  const foundMonthly = allPrices.data.find(
    (p) => p.recurring?.interval === 'month' && p.unit_amount === 5300 && p.currency === 'myr'
  )
  if (foundMonthly) {
    monthlyPrice = foundMonthly
    console.log('[Stripe Setup] Found existing monthly price:', monthlyPrice.id)
  } else {
    monthlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 5300,
      currency: 'myr',
      recurring: { interval: 'month', interval_count: 1 },
      nickname: 'LajuS Pro - Bulanan RM53 (Tanpa Had)',
      metadata: { plan: 'monthly', app: 'lajus' },
    })
    console.log('[Stripe Setup] Created monthly price:', monthlyPrice.id)
  }

  // 3. Pro Yearly Price (RM 616 = 61600 cents / year)
  let yearlyPrice: Stripe.Price | null = null
  const foundYearly = allPrices.data.find(
    (p) => p.recurring?.interval === 'year' && p.unit_amount === 61600 && p.currency === 'myr'
  )
  if (foundYearly) {
    yearlyPrice = foundYearly
    console.log('[Stripe Setup] Found existing yearly price:', yearlyPrice.id)
  } else {
    yearlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 61600,
      currency: 'myr',
      recurring: { interval: 'year', interval_count: 1 },
      nickname: 'LajuS Pro - Tahunan RM616 (Tanpa Had)',
      metadata: { plan: 'yearly', app: 'lajus' },
    })
    console.log('[Stripe Setup] Created yearly price:', yearlyPrice.id)
  }

  process.env.STRIPE_PRICE_MONTHLY = monthlyPrice.id
  process.env.STRIPE_PRICE_YEARLY = yearlyPrice.id
  console.log('[Stripe Setup] Ready - Monthly:', monthlyPrice.id, '| Yearly:', yearlyPrice.id)

  return {
    monthlyPriceId: monthlyPrice.id,
    yearlyPriceId: yearlyPrice.id,
  }
}
