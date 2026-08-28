'use client'

interface PlaceholderImageProps {
  text: string
  className?: string
}

export function PlaceholderImage({ text, className = '' }: PlaceholderImageProps) {
  return (
    <div className={`bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center ${className}`}>
      <span className="text-primary/50 font-bold text-2xl text-center px-4">{text}</span>
    </div>
  )
}