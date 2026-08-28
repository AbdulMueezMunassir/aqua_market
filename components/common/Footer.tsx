import Link from 'next/link'
import Image from 'next/image'
import { GlobeAltIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

export function Footer() {
  return (
    <footer className="w-full mt-20 bg-surface-container-highest dark:bg-inverse-surface border-t border-outline-variant">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-desktop py-12 max-w-container-max mx-auto">
        {/* Brand */}
        <div className="col-span-1 md:col-span-1 mb-8 md:mb-0">
          <div className="flex items-center gap-3 mb-6">
            <Image
              src="/images/logo.png"
              alt="Aqua Market Logo"
              width={32}
              height={32}
              className="h-8 w-8 object-contain opacity-80"
            />
            <span className="font-headline-md text-headline-md text-primary">Aqua Market</span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            Elevating the aquarium hobby with premium livestock and expert care.
          </p>
          <div className="flex gap-4">
            <GlobeAltIcon className="w-6 h-6 text-on-surface-variant hover:text-primary cursor-pointer transition-colors" />
            <EnvelopeIcon className="w-6 h-6 text-on-surface-variant hover:text-primary cursor-pointer transition-colors" />
          </div>
        </div>

        {/* Shop Links */}
        <div className="col-span-1">
          <h4 className="font-label-sm text-label-sm text-on-surface font-bold mb-4 uppercase tracking-wider">Shop</h4>
          <ul className="space-y-3 font-body-md text-body-md">
            <li><Link href="#" className="text-on-surface-variant hover:text-primary underline transition-opacity hover:opacity-80">Freshwater Fish</Link></li>
            <li><Link href="#" className="text-on-surface-variant hover:text-primary underline transition-opacity hover:opacity-80">Aquatic Plants</Link></li>
            <li><Link href="#" className="text-on-surface-variant hover:text-primary underline transition-opacity hover:opacity-80">Invertebrates</Link></li>
            <li><Link href="#" className="text-on-surface-variant hover:text-primary underline transition-opacity hover:opacity-80">New Arrivals</Link></li>
          </ul>
        </div>

        {/* Support Links */}
        <div className="col-span-1">
          <h4 className="font-label-sm text-label-sm text-on-surface font-bold mb-4 uppercase tracking-wider">Support</h4>
          <ul className="space-y-3 font-body-md text-body-md">
            <li><Link href="#" className="text-on-surface-variant hover:text-primary underline transition-opacity hover:opacity-80">About Us</Link></li>
            <li><Link href="#" className="text-on-surface-variant hover:text-primary underline transition-opacity hover:opacity-80">Shipping Policy</Link></li>
            <li><Link href="#" className="text-on-surface-variant hover:text-primary underline transition-opacity hover:opacity-80">Returns</Link></li>
            <li><Link href="#" className="text-on-surface-variant hover:text-primary underline transition-opacity hover:opacity-80">Contact</Link></li>
          </ul>
        </div>

        {/* Legal Links */}
        <div className="col-span-1">
          <h4 className="font-label-sm text-label-sm text-on-surface font-bold mb-4 uppercase tracking-wider">Legal</h4>
          <ul className="space-y-3 font-body-md text-body-md">
            <li><Link href="#" className="text-on-surface-variant hover:text-primary underline transition-opacity hover:opacity-80">Terms of Service</Link></li>
            <li><Link href="#" className="text-on-surface-variant hover:text-primary underline transition-opacity hover:opacity-80">Privacy</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-outline-variant/30 py-6 text-center">
        <p className="font-body-md text-body-md text-on-surface-variant">
          © 2024 Aqua Market Premium Aquarium Marketplace. All rights reserved.
        </p>
      </div>
    </footer>
  )
}