import { CreditCard, Banknote, ArrowLeftRight, Wallet, type LucideIcon } from 'lucide-react'
import { products, stockLevel, type Product } from '@/components/productos/mock-data'

export { products, formatCurrency } from '@/components/productos/mock-data'
export type { Product } from '@/components/productos/mock-data'

export function stockLevelLabel(
  product: Pick<Product, 'stock' | 'minStock'>,
): { variant: 'success' | 'warning' | 'danger' } {
  const level = stockLevel(product)
  if (level === 'out') return { variant: 'danger' }
  if (level === 'low') return { variant: 'warning' }
  return { variant: 'success' }
}

// Only sellable products (active + in stock) surface in the POS grid.
export const posProducts: Product[] = products.filter(
  (p) => p.status === 'activo' && p.stock > 0,
)

export const posCategories = Array.from(new Set(posProducts.map((p) => p.category)))

export interface Customer {
  id: string
  name: string
  taxId: string
  phone: string
}

export const FINAL_CONSUMER: Customer = {
  id: 'final',
  name: 'Consumidor final',
  taxId: 'XAXX010101000',
  phone: '',
}

export const customers: Customer[] = [
  { id: 'c1', name: 'María González', taxId: 'GORM850312AB1', phone: '55 1234 5678' },
  { id: 'c2', name: 'Carlos Ramírez', taxId: 'RACR900715CD2', phone: '55 8765 4321' },
  { id: 'c3', name: 'Distribuidora El Sol S.A.', taxId: 'DES120904EF3', phone: '55 2468 1357' },
  { id: 'c4', name: 'Ana Martínez', taxId: 'MAAA751128GH4', phone: '55 1357 2468' },
]

export type PaymentMethodId = 'efectivo' | 'tarjeta' | 'transferencia' | 'otro'

export interface PaymentMethod {
  id: PaymentMethodId
  label: string
  icon: LucideIcon
}

export const paymentMethods: PaymentMethod[] = [
  { id: 'efectivo', label: 'Efectivo', icon: Banknote },
  { id: 'tarjeta', label: 'Tarjeta', icon: CreditCard },
  { id: 'transferencia', label: 'Transferencia', icon: ArrowLeftRight },
  { id: 'otro', label: 'Otro', icon: Wallet },
]

// IVA rate applied to the net (subtotal - discount)
export const TAX_RATE = 0.16

export interface CartItem {
  product: Product
  quantity: number
  discount: number // absolute amount off the line
}

export interface CartTotals {
  subtotal: number
  discount: number
  tax: number
  total: number
}

export function lineSubtotal(item: CartItem): number {
  return item.product.salePrice * item.quantity
}

export function lineTotal(item: CartItem): number {
  return Math.max(0, lineSubtotal(item) - item.discount)
}

export function computeTotals(items: CartItem[]): CartTotals {
  const subtotal = items.reduce((sum, i) => sum + lineSubtotal(i), 0)
  const discount = items.reduce((sum, i) => sum + Math.min(i.discount, lineSubtotal(i)), 0)
  const net = Math.max(0, subtotal - discount)
  const tax = net * TAX_RATE
  return { subtotal, discount, tax, total: net + tax }
}
