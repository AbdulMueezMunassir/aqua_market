interface StatsCardProps {
  title: string
  value: string
  icon: React.ElementType
  trend?: string
  trendUp?: boolean
  color?: 'primary' | 'secondary' | 'tertiary' | 'error'
}

export function StatsCard({ title, value, icon: Icon, trend, trendUp, color = 'primary' }: StatsCardProps) {
  const colorClasses = {
    primary: 'bg-primary-container/20 text-primary',
    secondary: 'bg-secondary-container/40 text-secondary',
    tertiary: 'bg-tertiary-container/40 text-tertiary',
    error: 'bg-error-container text-error',
  }

  return (
    <div className="glass-panel rounded-xl p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-md ${
            trendUp 
              ? 'text-[#00696b] bg-[#00ced1]/10' 
              : 'text-error bg-error-container/30'
          }`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
      <div>
        <p className="font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">
          {title}
        </p>
        <h3 className="font-display-lg-mobile text-display-lg-mobile text-on-surface font-bold">
          {value}
        </h3>
      </div>
    </div>
  )
}