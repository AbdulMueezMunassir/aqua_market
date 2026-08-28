'use client'

import { SideNavBar } from '@/components/dashboard/SideNavBar'
import { 
  CloudArrowUpIcon, 
  DevicePhoneMobileIcon, 
  BeakerIcon, 
  DropletIcon, 
  RulerIcon,
  UtensilsIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

export default function AddFishPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <SideNavBar />
      
      <main className="flex-1 md:ml-[280px] p-margin-mobile md:p-margin-desktop pb-32">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">
              Add New Fish
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              Enter the details for the new aquatic species.
            </p>
          </div>
          <div className="hidden md:flex gap-4">
            <button className="px-6 py-2 rounded-xl glass-panel text-primary font-body-md text-body-md hover:bg-white/50 transition-colors">
              Cancel
            </button>
            <button className="px-6 py-2 rounded-xl btn-primary">
              Save Fish
            </button>
          </div>
        </header>
        
        <form className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-gutter">
            {/* Basic Info */}
            <div className="glass-panel rounded-lg p-6">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-6 border-b border-outline-variant/30 pb-4">
                Basic Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                    Common Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Neon Tetra"
                    className="w-full rounded-xl bg-[#F1F5F9] focus:bg-white/80 focus:backdrop-blur-md border border-transparent focus:border-primary px-4 py-3 text-on-surface font-body-md outline-none transition-all placeholder:text-outline"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                      Scientific Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Paracheirodon innesi"
                      className="w-full rounded-xl bg-[#F1F5F9] focus:bg-white/80 focus:backdrop-blur-md border border-transparent focus:border-primary px-4 py-3 text-on-surface font-body-md outline-none transition-all placeholder:text-outline italic"
                    />
                  </div>
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                      Category
                    </label>
                    <select className="w-full rounded-xl bg-[#F1F5F9] focus:bg-white/80 focus:backdrop-blur-md border border-transparent focus:border-primary px-4 py-3 text-on-surface font-body-md outline-none transition-all appearance-none">
                      <option>Freshwater</option>
                      <option>Saltwater</option>
                      <option>Brackish</option>
                      <option>Invertebrates</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div className="glass-panel rounded-lg p-6">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-6 border-b border-outline-variant/30 pb-4">
                Description
              </h3>
              <div className="border border-outline-variant/30 rounded-xl overflow-hidden bg-white/50">
                <div className="bg-surface-container-low p-2 flex gap-2 border-b border-outline-variant/30">
                  <button type="button" className="p-1 text-on-surface-variant hover:bg-surface-container-high rounded">
                    <span className="font-bold text-sm">B</span>
                  </button>
                  <button type="button" className="p-1 text-on-surface-variant hover:bg-surface-container-high rounded">
                    <span className="font-italic text-sm">I</span>
                  </button>
                  <button type="button" className="p-1 text-on-surface-variant hover:bg-surface-container-high rounded">
                    <span className="text-sm">•</span>
                  </button>
                </div>
                <textarea
                  className="w-full p-4 bg-transparent border-none focus:ring-0 text-on-surface font-body-md placeholder:text-outline resize-y min-h-[150px]"
                  placeholder="Describe the fish, its natural habitat, and care requirements..."
                />
              </div>
            </div>
            
            {/* Species Requirements */}
            <div className="glass-panel rounded-lg p-6">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-6 border-b border-outline-variant/30 pb-4">
                Species Requirements
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-surface-container-lowest/50 p-4 rounded-xl border border-outline-variant/20">
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 flex items-center gap-1">
                    <DevicePhoneMobileIcon className="w-4 h-4" /> Temp (°F)
                  </label>
                  <input
                    type="text"
                    placeholder="72-78"
                    className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:outline-none py-1 text-on-surface font-body-md"
                  />
                </div>
                <div className="bg-surface-container-lowest/50 p-4 rounded-xl border border-outline-variant/20">
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 flex items-center gap-1">
                    <BeakerIcon className="w-4 h-4" /> pH Range
                  </label>
                  <input
                    type="text"
                    placeholder="6.5-7.5"
                    className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:outline-none py-1 text-on-surface font-body-md"
                  />
                </div>
                <div className="bg-surface-container-lowest/50 p-4 rounded-xl border border-outline-variant/20">
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 flex items-center gap-1">
                    <DropletIcon className="w-4 h-4" /> Min Tank (Gal)
                  </label>
                  <input
                    type="text"
                    placeholder="10"
                    className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:outline-none py-1 text-on-surface font-body-md"
                  />
                </div>
                <div className="bg-surface-container-lowest/50 p-4 rounded-xl border border-outline-variant/20">
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 flex items-center gap-1">
                    <RulerIcon className="w-4 h-4" /> Max Size (in)
                  </label>
                  <input
                    type="text"
                    placeholder="2.5"
                    className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:outline-none py-1 text-on-surface font-body-md"
                  />
                </div>
                <div className="bg-surface-container-lowest/50 p-4 rounded-xl border border-outline-variant/20">
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 flex items-center gap-1">
                    <UtensilsIcon className="w-4 h-4" /> Diet
                  </label>
                  <select className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:outline-none py-1 text-on-surface font-body-md appearance-none">
                    <option>Omnivore</option>
                    <option>Carnivore</option>
                    <option>Herbivore</option>
                  </select>
                </div>
                <div className="bg-surface-container-lowest/50 p-4 rounded-xl border border-outline-variant/20">
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 flex items-center gap-1">
                    <UserGroupIcon className="w-4 h-4" /> Temperament
                  </label>
                  <select className="w-full bg-transparent border-b border-outline-variant focus:border-primary focus:outline-none py-1 text-on-surface font-body-md appearance-none">
                    <option>Peaceful</option>
                    <option>Semi-Aggressive</option>
                    <option>Aggressive</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Media & Settings */}
          <div className="space-y-gutter">
            {/* Image Upload */}
            <div className="glass-panel rounded-lg p-6">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-4 border-b border-outline-variant/30 pb-4">
                Media
              </h3>
              <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 text-center hover:bg-surface-container-lowest/50 transition-colors cursor-pointer mb-4">
                <CloudArrowUpIcon className="w-12 h-12 text-outline mx-auto mb-2" />
                <p className="font-body-md text-body-md text-on-surface">Drag &amp; drop images here</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">or click to browse</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="aspect-square rounded-lg bg-surface-container-high border border-outline-variant/30 overflow-hidden relative group">
                  <Image
                    src="/images/neon-tetra.jpg"
                    alt="Preview"
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <TrashIcon className="w-5 h-5 text-white cursor-pointer" />
                  </div>
                </div>
                <div className="aspect-square rounded-lg border-2 border-dashed border-outline-variant flex items-center justify-center text-outline cursor-pointer hover:bg-surface-container-lowest/50">
                  <PlusIcon className="w-6 h-6" />
                </div>
              </div>
            </div>
            
            {/* Pricing & Inventory */}
            <div className="glass-panel rounded-lg p-6">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-4 border-b border-outline-variant/30 pb-4">
                Pricing &amp; Stock
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                      Price (Single)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-on-surface-variant">LKR</span>
                      <input
                        type="text"
                        placeholder="1500.00"
                        className="w-full rounded-xl bg-[#F1F5F9] focus:bg-white/80 focus:backdrop-blur-md border border-transparent focus:border-primary px-4 py-3 text-on-surface font-body-md outline-none transition-all pl-12"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                      Price (Pair)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-on-surface-variant">LKR</span>
                      <input
                        type="text"
                        placeholder="2800.00"
                        className="w-full rounded-xl bg-[#F1F5F9] focus:bg-white/80 focus:backdrop-blur-md border border-transparent focus:border-primary px-4 py-3 text-on-surface font-body-md outline-none transition-all pl-12"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                      Stock Qty
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full rounded-xl bg-[#F1F5F9] focus:bg-white/80 focus:backdrop-blur-md border border-transparent focus:border-primary px-4 py-3 text-on-surface font-body-md outline-none transition-all"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">
                      Low Alert
                    </label>
                    <input
                      type="number"
                      placeholder="5"
                      className="w-full rounded-xl bg-[#F1F5F9] focus:bg-white/80 focus:backdrop-blur-md border border-transparent focus:border-primary px-4 py-3 text-on-surface font-body-md outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Publishing */}
            <div className="glass-panel rounded-lg p-6">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-4 border-b border-outline-variant/30 pb-4">
                Publishing
              </h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-body-md text-body-md text-on-surface block">Active Status</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Make fish visible on store
                    </span>
                  </div>
                  <div className="relative">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                  </div>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-body-md text-body-md text-on-surface block">Featured Collection</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Show on homepage
                    </span>
                  </div>
                  <div className="relative">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </form>
        
        {/* Mobile Sticky Footer */}
        <div className="fixed bottom-0 left-0 w-full glass-panel p-4 flex gap-4 md:hidden z-40 border-t border-outline-variant/30">
          <button className="flex-1 py-3 rounded-xl border border-outline-variant text-on-surface font-body-md text-body-md bg-white/50">
            Cancel
          </button>
          <button className="flex-1 py-3 rounded-xl btn-primary">
            Save Fish
          </button>
        </div>
      </main>
    </div>
  )
}