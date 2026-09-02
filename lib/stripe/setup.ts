import Stripe from 'stripe'

// Stripe client singleton with build-time safe fallback
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || 'sk_live_placeholder_for_build',
  {
    apiVersion: '2026-08-26.dahlia',
  }
)

/**
 * Auto-creates LajuS products & prices in Stripe if they do not exist yet.
 * Supports:
 * - Starter: RM 15/month (50 customers)
 * - Growth: RM 35/month (120 customers)
 * - Pro Monthly: RM 53/month (Unlimited)
 * - Pro Yearly: RM 616/year (Unlimited)
 */
export async function ensureStripeProducts(): Promise<{
  starterPriceId: string
  growthPriceId: string
  monthlyPriceId: string
  yearlyPriceId: string
}> {
  if (
    process.env.STRIPE_PRICE_STARTER &&
    process.env.STRIPE_PRICE_GROWTH &&
    process.env.STRIPE_PRICE_MONTHLY &&
    process.env.STRIPE_PRICE_YEARLY
  ) {
    return {
      starterPriceId: process.env.STRIPE_PRICE_STARTER,
      growthPriceId: process.env.STRIPE_PRICE_GROWTH,
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
      name: 'LajuS Loyalty',
      description:
        'Sistem Kad Kesetiaan & Cop Stamp Digital LajuS untuk peniaga.',
      metadata: { app: 'lajus' },
    })
    console.log('[Stripe Setup] Created new product:', product.id)
  }

  const allPrices = await stripe.prices.list({ product: product.id, active: true, limit: 50 })

  // 2. Starter Price (RM 15 = 1500 cents / month)
  let starterPrice: Stripe.Price | null = null
  const foundStarter = allPrices.data.find(
    (p) => p.recurring?.interval === 'month' && p.unit_amount === 1500 && p.currency === 'myr'
  )
  if (foundStarter) {
    starterPrice = foundStarter
  } else {
    starterPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 1500,
      currency: 'myr',
      recurring: { interval: 'month', interval_count: 1 },
      nickname: 'LajuS Starter - Bulanan RM15 (50 Pelanggan)',
      metadata: { plan: 'starter', app: 'lajus' },
    })
  }

  // 3. Growth Price (RM 35 = 3500 cents / month)
  let growthPrice: Stripe.Price | null = null
  const foundGrowth = allPrices.data.find(
    (p) => p.recurring?.interval === 'month' && p.unit_amount === 3500 && p.currency === 'myr'
  )
  if (foundGrowth) {
    growthPrice = foundGrowth
  } else {
    growthPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 3500,
      currency: 'myr',
      recurring: { interval: 'month', interval_count: 1 },
      nickname: 'LajuS Growth - Bulanan RM35 (120 Pelanggan)',
      metadata: { plan: 'growth', app: 'lajus' },
    })
  }

  // 4. Pro Monthly Price (RM 53 = 5300 cents / month)
  let monthlyPrice: Stripe.Price | null = null
  const foundMonthly = allPrices.data.find(
    (p) => p.recurring?.interval === 'month' && p.unit_amount === 5300 && p.currency === 'myr'
  )
  if (foundMonthly) {
    monthlyPrice = foundMonthly
  } else {
    monthlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 5300,
      currency: 'myr',
      recurring: { interval: 'month', interval_count: 1 },
      nickname: 'LajuS Pro - Bulanan RM53 (Tanpa Had)',
      metadata: { plan: 'monthly', app: 'lajus' },
    })
  }

  // 5. Pro Yearly Price (RM 616 = 61600 cents / year)
  let yearlyPrice: Stripe.Price | null = null
  const foundYearly = allPrices.data.find(
    (p) => p.recurring?.interval === 'year' && p.unit_amount === 61600 && p.currency === 'myr'
  )
  if (foundYearly) {
    yearlyPrice = foundYearly
  } else {
    yearlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 61600,
      currency: 'myr',
      recurring: { interval: 'year', interval_count: 1 },
      nickname: 'LajuS Pro - Tahunan RM616 (Tanpa Had)',
      metadata: { plan: 'yearly', app: 'lajus' },
    })
  }

  process.env.STRIPE_PRICE_STARTER = starterPrice.id
  process.env.STRIPE_PRICE_GROWTH = growthPrice.id
  process.env.STRIPE_PRICE_MONTHLY = monthlyPrice.id
  process.env.STRIPE_PRICE_YEARLY = yearlyPrice.id

  console.log('[Stripe Setup] Ready - Starter:', starterPrice.id, '| Growth:', growthPrice.id, '| Pro M:', monthlyPrice.id, '| Pro Y:', yearlyPrice.id)

  return {
    starterPriceId: starterPrice.id,
    growthPriceId: growthPrice.id,
    monthlyPriceId: monthlyPrice.id,
    yearlyPriceId: yearlyPrice.id,
  }
}
