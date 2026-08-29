interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning'
  className?: string
}

export function Badge({ children, variant = 'primary', className = '' }: BadgeProps) {
  const variants = {
    primary: 'bg-primary/10 text-primary border border-primary/20',
    secondary: 'bg-secondary/10 text-secondary border border-secondary/20',
    success: 'bg-green-500/10 text-green-600 border border-green-500/20',
    error: 'bg-error/10 text-error border border-error/20',
    warning: 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20',
  }

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}