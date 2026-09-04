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
  cardUnitPriceId: string
}> {
  if (
    process.env.STRIPE_PRICE_MONTHLY &&
    process.env.STRIPE_PRICE_YEARLY &&
    process.env.STRIPE_PRICE_CARD_UNIT
  ) {
    return {
      monthlyPriceId: process.env.STRIPE_PRICE_MONTHLY,
      yearlyPriceId: process.env.STRIPE_PRICE_YEARLY,
      cardUnitPriceId: process.env.STRIPE_PRICE_CARD_UNIT,
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

  // 2. Pro Monthly Price (RM 69 = 6900 cents / month) - Up 30% from RM53 (53 * 1.30 = 68.90 -> RM69)
  let monthlyPrice: Stripe.Price | null = null
  const foundMonthly = allPrices.data.find(
    (p) => p.recurring?.interval === 'month' && p.unit_amount === 6900 && p.currency === 'myr'
  )
  if (foundMonthly) {
    monthlyPrice = foundMonthly
    console.log('[Stripe Setup] Found existing monthly price:', monthlyPrice.id)
  } else {
    monthlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 6900,
      currency: 'myr',
      recurring: { interval: 'month', interval_count: 1 },
      nickname: 'LajuS Pro - Bulanan RM69 (Tanpa Had)',
      metadata: { plan: 'monthly', app: 'lajus' },
    })
    console.log('[Stripe Setup] Created monthly price:', monthlyPrice.id)
  }

  // 3. Pro Yearly Price (RM 800 = 80000 cents / year) - Up 30% from RM616 (616 * 1.30 = 800.80 -> RM800)
  let yearlyPrice: Stripe.Price | null = null
  const foundYearly = allPrices.data.find(
    (p) => p.recurring?.interval === 'year' && p.unit_amount === 80000 && p.currency === 'myr'
  )
  if (foundYearly) {
    yearlyPrice = foundYearly
    console.log('[Stripe Setup] Found existing yearly price:', yearlyPrice.id)
  } else {
    yearlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 80000,
      currency: 'myr',
      recurring: { interval: 'year', interval_count: 1 },
      nickname: 'LajuS Pro - Tahunan RM800 (Tanpa Had)',
      metadata: { plan: 'yearly', app: 'lajus' },
    })
    console.log('[Stripe Setup] Created yearly price:', yearlyPrice.id)
  }

  // 4. One-Off Card Unit Price (RM0.65 = 65 cents / card, one-time payment) - Up 30% from RM0.50
  let cardUnitPrice: Stripe.Price | null = null
  const foundCardUnit = allPrices.data.find(
    (p) => !p.recurring && p.unit_amount === 65 && p.currency === 'myr'
  )
  if (foundCardUnit) {
    cardUnitPrice = foundCardUnit
    console.log('[Stripe Setup] Found existing card unit price:', cardUnitPrice.id)
  } else {
    cardUnitPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 65,
      currency: 'myr',
      nickname: 'Kad Cop Digital LajuS - RM0.65 Sekeping (One-Off)',
      metadata: { plan: 'one_off_card', app: 'lajus' },
    })
    console.log('[Stripe Setup] Created card unit price:', cardUnitPrice.id)
  }

  process.env.STRIPE_PRICE_MONTHLY = monthlyPrice.id
  process.env.STRIPE_PRICE_YEARLY = yearlyPrice.id
  process.env.STRIPE_PRICE_CARD_UNIT = cardUnitPrice.id
  console.log('[Stripe Setup] Ready - Monthly:', monthlyPrice.id, '| Yearly:', yearlyPrice.id, '| Card Unit:', cardUnitPrice.id)

  return {
    monthlyPriceId: monthlyPrice.id,
    yearlyPriceId: yearlyPrice.id,
    cardUnitPriceId: cardUnitPrice.id,
  }
}
