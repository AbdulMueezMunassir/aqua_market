export function LoadingSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="glass-panel rounded-xl overflow-hidden">
          <div className="h-48 bg-surface-container-high animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-surface-container-high animate-pulse rounded w-3/4" />
            <div className="h-3 bg-surface-container-high animate-pulse rounded w-1/2" />
            <div className="flex justify-between items-center">
              <div className="h-6 bg-surface-container-high animate-pulse rounded w-1/3" />
              <div className="h-8 bg-surface-container-high animate-pulse rounded w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}