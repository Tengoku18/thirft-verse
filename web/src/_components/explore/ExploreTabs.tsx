'use client'

import { Package, Store } from 'lucide-react'

export type ExploreTab = 'products' | 'stores'

interface ExploreTabsProps {
  activeTab: ExploreTab
  onTabChange: (tab: ExploreTab) => void
  productsCount: number
  storesCount: number
  className?: string
}

export default function ExploreTabs({
  activeTab,
  onTabChange,
  productsCount,
  storesCount,
  className = '',
}: ExploreTabsProps) {
  const isProducts = activeTab === 'products'

  return (
    <div
      role="tablist"
      aria-label="Browse products or stores"
      className={`border-border/70 bg-surface/80 relative flex w-full gap-1 rounded-full border p-1 shadow-[0_1px_2px_rgba(59,47,47,0.04)] backdrop-blur-sm sm:inline-flex sm:w-auto ${className}`}
    >
      {/* Sliding active pill */}
      <span
        aria-hidden
        className={`bg-primary absolute inset-y-1 rounded-full shadow-sm transition-[left,right] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isProducts ? 'left-1 right-[calc(50%+2px)]' : 'left-[calc(50%+2px)] right-1'
        } sm:hidden`}
      />

      <TabButton
        icon={<Package className="h-3.5 w-3.5" strokeWidth={2.2} />}
        label="Products"
        count={productsCount}
        active={isProducts}
        onClick={() => onTabChange('products')}
        role="tab"
      />
      <TabButton
        icon={<Store className="h-3.5 w-3.5" strokeWidth={2.2} />}
        label="Stores"
        count={storesCount}
        active={!isProducts}
        onClick={() => onTabChange('stores')}
        role="tab"
      />
    </div>
  )
}

interface TabButtonProps {
  icon: React.ReactNode
  label: string
  count: number
  active: boolean
  onClick: () => void
  role?: string
}

function TabButton({ icon, label, count, active, onClick, role }: TabButtonProps) {
  return (
    <button
      role={role}
      aria-selected={active}
      onClick={onClick}
      className={`relative z-10 flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2 font-sans text-sm font-semibold transition-colors duration-300 sm:flex-initial ${
        active
          ? 'text-surface sm:bg-primary sm:shadow-sm'
          : 'text-primary/70 hover:text-primary sm:hover:bg-background/80'
      }`}
    >
      <span
        className={`transition-transform duration-300 ${
          active ? 'scale-110' : 'scale-100'
        }`}
      >
        {icon}
      </span>
      <span>{label}</span>
      <span
        className={`rounded-full px-2 py-0.5 font-sans text-[10px] font-bold tabular-nums tracking-wide transition-all duration-300 ${
          active
            ? 'bg-surface/20 text-surface'
            : 'bg-background text-primary/60'
        }`}
      >
        {count}
      </span>
    </button>
  )
}
