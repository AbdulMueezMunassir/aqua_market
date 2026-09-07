import crypto from 'crypto-js'

// PayHere Configuration
export const PAYHERE_CONFIG = {
  merchantId: process.env.PAYHERE_MERCHANT_ID || 'YOUR_MERCHANT_ID',
  secret: process.env.PAYHERE_SECRET || 'YOUR_SECRET_KEY',
  sandbox: process.env.PAYHERE_SANDBOX === 'true' || true,
  returnUrl: process.env.PAYHERE_RETURN_URL || 'http://localhost:3000/order-success',
  cancelUrl: process.env.PAYHERE_CANCEL_URL || 'http://localhost:3000/checkout',
  notifyUrl: process.env.PAYHERE_NOTIFY_URL || 'http://localhost:3000/api/payment/notify',
}

// PayHere Base URLs
export const PAYHERE_URLS = {
  sandbox: 'https://sandbox.payhere.lk/pay/checkout',
  live: 'https://www.payhere.lk/pay/checkout',
}

// Generate PayHere signature
export function generateSignature(
  merchantId: string,
  orderId: string,
  amount: number,
  currency: string,
  secret: string
): string {
  const hash = crypto
    .MD5(`${merchantId}${orderId}${amount}${currency}${secret}`)
    .toString()
    .toUpperCase()
  return hash
}

// Generate Payment Hash
export function generatePaymentHash(
  merchantId: string,
  orderId: string,
  amount: number,
  currency: string,
  secret: string
): string {
  const hash = crypto
    .MD5(`${merchantId}${orderId}${amount}${currency}${secret}`)
    .toString()
    .toUpperCase()
  return hash
}

// Get PayHere checkout URL
export function getPayHereCheckoutUrl(): string {
  return PAYHERE_CONFIG.sandbox ? PAYHERE_URLS.sandbox : PAYHERE_URLS.live
}

// Interface for PayHere payment data
export interface PayHerePaymentData {
  merchant_id: string
  order_id: string
  payhere_amount: number
  payhere_currency: string
  merchant_secret?: string
  return_url: string
  cancel_url: string
  notify_url: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  delivery_address: string
  delivery_city: string
  delivery_country: string
  hash?: string
  items?: Array<{
    name: string
    quantity: number
    price: number
  }>
}

// Generate PayHere form data
export function generatePayHereFormData(
  paymentData: PayHerePaymentData
): PayHerePaymentData {
  const { merchantId, secret, returnUrl, cancelUrl, notifyUrl } = PAYHERE_CONFIG
  
  const formData: PayHerePaymentData = {
    merchant_id: merchantId,
    order_id: paymentData.order_id,
    payhere_amount: paymentData.payhere_amount,
    payhere_currency: paymentData.payhere_currency || 'LKR',
    return_url: returnUrl,
    cancel_url: cancelUrl,
    notify_url: notifyUrl,
    first_name: paymentData.first_name,
    last_name: paymentData.last_name,
    email: paymentData.email,
    phone: paymentData.phone,
    address: paymentData.address,
    city: paymentData.city,
    country: paymentData.country || 'Sri Lanka',
    delivery_address: paymentData.delivery_address || paymentData.address,
    delivery_city: paymentData.delivery_city || paymentData.city,
    delivery_country: paymentData.delivery_country || 'Sri Lanka',
    items: paymentData.items || [],
  }
  
  // Generate hash
  formData.hash = generateSignature(
    merchantId,
    formData.order_id,
    formData.payhere_amount,
    formData.payhere_currency,
    secret
  )
  
  return formData
}