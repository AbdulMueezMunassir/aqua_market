interface CategoryFilterProps {
  selected: string
  onChange: (category: string) => void
}

const categories = [
  { id: 'all', label: 'All' },
  { id: 'tetras', label: 'Tetras' },
  { id: 'gouramis', label: 'Gouramis' },
  { id: 'cichlids', label: 'Cichlids' },
  { id: 'bettas', label: 'Bettas' },
]

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div>
      <h3 className="font-label-sm text-label-sm text-on-surface mb-3 uppercase tracking-wider">
        Category
      </h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <label key={category.id} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={selected === category.id}
              onChange={() => onChange(selected === category.id ? 'all' : category.id)}
              className="rounded border-outline-variant text-primary focus:ring-primary-container w-4 h-4"
            />
            <span className={`text-body-md text-on-surface-variant group-hover:text-primary transition-colors ${
              selected === category.id ? 'font-medium' : ''
            }`}>
              {category.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}