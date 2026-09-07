'use client'

import Link from 'next/link'
import { useState } from 'react'

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer className="w-full mt-20 bg-surface-container-highest dark:bg-inverse-surface border-t border-outline-variant/50">
      {/* Main Footer */}
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
                A
              </div>
              <div>
                <span className="font-headline-md text-headline-md text-primary block">
                  Aqua Market
                </span>
                <span className="text-xs text-on-surface-variant">Premium Aquarium Marketplace</span>
              </div>
            </Link>
            
            <p className="font-body-md text-body-md text-on-surface-variant mb-6 max-w-sm leading-relaxed">
              Elevating the aquarium hobby with premium livestock, expert care, and unparalleled quality. 
              Your trusted partner for aquatic excellence.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-primary hover:text-white flex items-center justify-center text-on-surface-variant transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                aria-label="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-primary hover:text-white flex items-center justify-center text-on-surface-variant transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-primary hover:text-white flex items-center justify-center text-on-surface-variant transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                aria-label="YouTube"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-primary hover:text-white flex items-center justify-center text-on-surface-variant transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                aria-label="Twitter"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l11.733 16h4.267l-11.733 -16zM4 20l6.768 -6.768M19.5 4l-6.768 6.768"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-surface-container-low hover:bg-primary hover:text-white flex items-center justify-center text-on-surface-variant transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
                aria-label="TikTok"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-label-sm text-label-sm text-on-surface font-bold mb-4 uppercase tracking-wider">
              Shop
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/shop?category=Freshwater" className="text-on-surface-variant hover:text-primary transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary/30 group-hover:bg-primary transition-colors"></span>
                  Freshwater Fish
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Plants" className="text-on-surface-variant hover:text-primary transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary/30 group-hover:bg-primary transition-colors"></span>
                  Aquatic Plants
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Invertebrates" className="text-on-surface-variant hover:text-primary transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary/30 group-hover:bg-primary transition-colors"></span>
                  Invertebrates
                </Link>
              </li>
              <li>
                <Link href="/shop?sort=-createdAt" className="text-on-surface-variant hover:text-primary transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary/30 group-hover:bg-primary transition-colors"></span>
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/shop?sort=-rating" className="text-on-surface-variant hover:text-primary transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary/30 group-hover:bg-primary transition-colors"></span>
                  Popular
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-label-sm text-label-sm text-on-surface font-bold mb-4 uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-on-surface-variant hover:text-primary transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary/30 group-hover:bg-primary transition-colors"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-on-surface-variant hover:text-primary transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary/30 group-hover:bg-primary transition-colors"></span>
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-on-surface-variant hover:text-primary transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary/30 group-hover:bg-primary transition-colors"></span>
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="#" className="text-on-surface-variant hover:text-primary transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary/30 group-hover:bg-primary transition-colors"></span>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-on-surface-variant hover:text-primary transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary/30 group-hover:bg-primary transition-colors"></span>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Newsletter */}
          <div>
            <h4 className="font-label-sm text-label-sm text-on-surface font-bold mb-4 uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-3 mb-6">
              <li>
                <Link href="#" className="text-on-surface-variant hover:text-primary transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary/30 group-hover:bg-primary transition-colors"></span>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-on-surface-variant hover:text-primary transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary/30 group-hover:bg-primary transition-colors"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-on-surface-variant hover:text-primary transition-colors duration-200 text-sm flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary/30 group-hover:bg-primary transition-colors"></span>
                  Cookie Policy
                </Link>
              </li>
            </ul>

            {/* Newsletter Signup */}
            <div className="mt-4">
              <h4 className="font-label-sm text-label-sm text-on-surface font-bold mb-3 uppercase tracking-wider">
                Subscribe
              </h4>
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full btn-primary text-sm py-2.5 justify-center"
                >
                  {subscribed ? '✅ Subscribed!' : 'Subscribe'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-outline-variant/30">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-on-surface-variant text-sm">
            © {new Date().getFullYear()} Aqua Market Premium Aquarium Marketplace. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-on-surface-variant">
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Cookies
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xs">Payment Methods:</span>
              <span className="flex gap-1">
                <span className="px-2 py-1 bg-surface-container-low rounded text-xs">💳 Visa</span>
                <span className="px-2 py-1 bg-surface-container-low rounded text-xs">💳 Master</span>
                <span className="px-2 py-1 bg-surface-container-low rounded text-xs">🏦 Bank</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}