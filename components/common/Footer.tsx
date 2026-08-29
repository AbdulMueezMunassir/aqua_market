import Link from 'next/link'

export function Footer() {
  return (
    <footer className="w-full mt-20 bg-surface-container-highest dark:bg-inverse-surface border-t border-outline-variant">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-desktop py-12 max-w-container-max mx-auto">
        {/* Brand */}
        <div className="col-span-1 md:col-span-1 mb-8 md:mb-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <span className="font-headline-md text-headline-md text-primary">Aqua Market</span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            Elevating the aquarium hobby with premium livestock and expert care.
          </p>
          <div className="flex gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-on-surface-variant hover:text-primary cursor-pointer transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a9.004 9.004 0 0 1 8.716 6.747M12 3a9.004 9.004 0 0 0-8.716 6.747" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-on-surface-variant hover:text-primary cursor-pointer transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
          </div>
        </div>

        {/* Shop Links */}
        <div className="col-span-1">
          <h4 className="font-label-sm text-label-sm text-on-surface font-bold mb-4 uppercase tracking-wider">Shop</h4>
          <ul className="space-y-3 font-body-md text-body-md">
            <li><Link href="#" className="text-on-surface-variant hover:text-primary transition-opacity hover:opacity-80">Freshwater Fish</Link></li>
            <li><Link href="#" className="text-on-surface-variant hover:text-primary transition-opacity hover:opacity-80">Aquatic Plants</Link></li>
            <li><Link href="#" className="text-on-surface-variant hover:text-primary transition-opacity hover:opacity-80">Invertebrates</Link></li>
            <li><Link href="#" className="text-on-surface-variant hover:text-primary transition-opacity hover:opacity-80">New Arrivals</Link></li>
          </ul>
        </div>

        {/* Support Links */}
        <div className="col-span-1">
          <h4 className="font-label-sm text-label-sm text-on-surface font-bold mb-4 uppercase tracking-wider">Support</h4>
          <ul className="space-y-3 font-body-md text-body-md">
            <li><Link href="#" className="text-on-surface-variant hover:text-primary transition-opacity hover:opacity-80">About Us</Link></li>
            <li><Link href="#" className="text-on-surface-variant hover:text-primary transition-opacity hover:opacity-80">Shipping Policy</Link></li>
            <li><Link href="#" className="text-on-surface-variant hover:text-primary transition-opacity hover:opacity-80">Returns</Link></li>
            <li><Link href="#" className="text-on-surface-variant hover:text-primary transition-opacity hover:opacity-80">Contact</Link></li>
          </ul>
        </div>

        {/* Legal Links */}
        <div className="col-span-1">
          <h4 className="font-label-sm text-label-sm text-on-surface font-bold mb-4 uppercase tracking-wider">Legal</h4>
          <ul className="space-y-3 font-body-md text-body-md">
            <li><Link href="#" className="text-on-surface-variant hover:text-primary transition-opacity hover:opacity-80">Terms of Service</Link></li>
            <li><Link href="#" className="text-on-surface-variant hover:text-primary transition-opacity hover:opacity-80">Privacy</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-outline-variant/30 py-6 text-center">
        <p className="font-body-md text-body-md text-on-surface-variant">
          © 2026 Aqua Market Premium Aquarium Marketplace. All rights reserved.
        </p>
      </div>
    </footer>
  )
}