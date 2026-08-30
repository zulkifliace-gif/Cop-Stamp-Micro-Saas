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

  // 1. Find or create the product
  let product: Stripe.Product | null = null
  const existingProducts = await stripe.products.search({
    query: 'name:"LajuS Pro" AND active:"true"',
    limit: 1,
  })

  if (existingProducts.data.length > 0) {
    product = existingProducts.data[0]
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

  // 2. Find or create Monthly price (RM 53 = 5300 cents)
  let monthlyPrice: Stripe.Price | null = null
  const allPrices = await stripe.prices.list({ product: product.id, active: true, limit: 20 })

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
      nickname: 'LajuS Pro - Bulanan RM53',
      metadata: { plan: 'monthly', app: 'lajus' },
    })
    console.log('[Stripe Setup] Created monthly price:', monthlyPrice.id)
  }

  // 3. Find or create Yearly price (RM 616 = 61600 cents)
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
      nickname: 'LajuS Pro - Tahunan RM616',
      metadata: { plan: 'yearly', app: 'lajus' },
    })
    console.log('[Stripe Setup] Created yearly price:', yearlyPrice.id)
  }

  process.env.STRIPE_PRICE_MONTHLY = monthlyPrice.id
  process.env.STRIPE_PRICE_YEARLY = yearlyPrice.id
  console.log('[Stripe Setup] Ready - Monthly:', monthlyPrice.id, '| Yearly:', yearlyPrice.id)

  return { monthlyPriceId: monthlyPrice.id, yearlyPriceId: yearlyPrice.id }
}
