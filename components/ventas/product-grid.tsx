'use client'

import * as React from 'react'
import { Search, Package, Plus } from 'lucide-react'
import { Input } from '@/components/app_mitienda/input'
import { Badge } from '@/components/app_mitienda/badge'
import { cn } from '@/lib/utils'
import {
  posProducts,
  posCategories,
  formatCurrency,
  stockLevelLabel,
  type Product,
} from './mock-data'

interface ProductGridProps {
  onAdd: (product: Product) => void
}

export function ProductGrid({ onAdd }: ProductGridProps) {
  const [query, setQuery] = React.useState('')
  const [category, setCategory] = React.useState<string | null>(null)

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return posProducts.filter((p) => {
      const matchesCategory = !category || p.category === category
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.barcode.includes(q)
      return matchesCategory && matchesQuery
    })
  }, [query, category])

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-col gap-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar producto..."
          leadingIcon={<Search />}
          className="h-12 text-base"
          aria-label="Buscar producto"
        />
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
          <CategoryChip active={!category} onClick={() => setCategory(null)}>
            Todas
          </CategoryChip>
          {posCategories.map((c) => (
            <CategoryChip key={c} active={category === c} onClick={() => setCategory(c)}>
              {c}
            </CategoryChip>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Package className="size-6" />
          </div>
          <div>
            <p className="font-medium">Sin resultados</p>
            <p className="text-sm text-muted-foreground">
              No se encontraron productos para tu búsqueda.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid flex-1 auto-rows-max grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))] gap-3 overflow-y-auto pb-2">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={onAdd} />
          ))}
        </div>
      )}
    </div>
  )
}

function CategoryChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'h-9 rounded-full border px-4 text-sm font-medium transition-colors duration-150',
        active
          ? 'border-transparent bg-primary text-primary-foreground shadow-xs'
          : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground',
      )}
    >
      {children}
    </button>
  )
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: (p: Product) => void }) {
  const level = stockLevelLabel(product)
  return (
    <button
      type="button"
      onClick={() => onAdd(product)}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card text-left shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/35 active:translate-y-0"
    >
      <div
        className="flex h-20 items-center justify-center"
        style={{ backgroundColor: product.color }}
        aria-hidden
      >
        <Package className="size-7 text-white/85" />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="line-clamp-2 text-sm font-medium leading-snug">{product.name}</p>
        <p className="font-mono text-[11px] text-muted-foreground">{product.code}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <span className="text-base font-semibold tabular-nums">
            {formatCurrency(product.salePrice)}
          </span>
          <Badge variant={level.variant} size="sm">
            {product.stock}
          </Badge>
        </div>
      </div>
      <span
        className="pointer-events-none absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100"
        aria-hidden
      >
        <Plus className="size-4" />
      </span>
    </button>
  )
}
