// lib/stripe.config.ts

export const STRIPE_CONFIG = {
  // Your Stripe keys from the dashboard
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here',
  secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_your_key_here',
  
  // Currency settings
  currency: 'lkr',
  currencySymbol: 'LKR',
  
  // Success/Cancel URLs
  successUrl: process.env.STRIPE_SUCCESS_URL || 'http://localhost:3000/order-success',
  cancelUrl: process.env.STRIPE_CANCEL_URL || 'http://localhost:3000/checkout',
  
  // Payment method types
  paymentMethods: ['card', 'fpx', 'grabpay', 'promptpay'] as const,
}

// Stripe test card numbers for practice
export const STRIPE_TEST_CARDS = {
  success: '4242 4242 4242 4242',
  declined: '4000 0000 0000 0002',
  insufficient: '4000 0000 0000 9995',
  expired: '4000 0000 0000 0069',
  incorrectCvc: '4000 0000 0000 0127',
  requiresAuth: '4000 0025 0000 3155',
  threeDSecure: '4000 0027 6000 3184',
}