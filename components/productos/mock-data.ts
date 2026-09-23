export type ProductStatus = 'activo' | 'inactivo'

export interface Product {
  id: string
  code: string
  barcode: string
  name: string
  category: string
  brand: string
  purchasePrice: number
  salePrice: number
  stock: number
  minStock: number
  status: ProductStatus
  color: string
}

export const categories = [
  'Bebidas',
  'Panadería',
  'Lácteos',
  'Abarrotes',
  'Snacks',
  'Limpieza',
] as const

export const brands = [
  'Coca-Cola',
  'Bimbo',
  'Nestlé',
  'La Serenísima',
  'Arcor',
  'Genérico',
] as const

export const units = [
  'Unidad',
  'Kilogramo',
  'Gramo',
  'Litro',
  'Mililitro',
  'Paquete',
  'Caja',
] as const

// Deterministic accent colors for product thumbnails
const palette = [
  'oklch(0.62 0.19 27)',
  'oklch(0.65 0.17 145)',
  'oklch(0.63 0.16 250)',
  'oklch(0.7 0.16 60)',
  'oklch(0.6 0.2 320)',
  'oklch(0.66 0.15 190)',
]

export const products: Product[] = [
  {
    id: '1',
    code: 'BEB-0001',
    barcode: '7501055300012',
    name: 'Coca-Cola 600ml',
    category: 'Bebidas',
    brand: 'Coca-Cola',
    purchasePrice: 12.5,
    salePrice: 22,
    stock: 148,
    minStock: 40,
    status: 'activo',
    color: palette[0],
  },
  {
    id: '2',
    code: 'PAN-0007',
    barcode: '7501000110025',
    name: 'Pan de caja blanco',
    category: 'Panadería',
    brand: 'Bimbo',
    purchasePrice: 28,
    salePrice: 42.5,
    stock: 32,
    minStock: 15,
    status: 'activo',
    color: palette[3],
  },
  {
    id: '3',
    code: 'LAC-0014',
    barcode: '7790040991026',
    name: 'Leche entera 1L',
    category: 'Lácteos',
    brand: 'La Serenísima',
    purchasePrice: 18.9,
    salePrice: 29.9,
    stock: 9,
    minStock: 20,
    status: 'activo',
    color: palette[2],
  },
  {
    id: '4',
    code: 'SNK-0021',
    barcode: '7790580123047',
    name: 'Galletas surtidas 300g',
    category: 'Snacks',
    brand: 'Arcor',
    purchasePrice: 15.2,
    salePrice: 26,
    stock: 74,
    minStock: 25,
    status: 'activo',
    color: palette[4],
  },
  {
    id: '5',
    code: 'ABA-0033',
    barcode: '7501058611058',
    name: 'Café soluble 170g',
    category: 'Abarrotes',
    brand: 'Nestlé',
    purchasePrice: 62,
    salePrice: 98.5,
    stock: 41,
    minStock: 12,
    status: 'activo',
    color: palette[1],
  },
  {
    id: '6',
    code: 'LIM-0040',
    barcode: '7501025403069',
    name: 'Detergente líquido 1L',
    category: 'Limpieza',
    brand: 'Genérico',
    purchasePrice: 24,
    salePrice: 39,
    stock: 0,
    minStock: 10,
    status: 'inactivo',
    color: palette[5],
  },
  {
    id: '7',
    code: 'BEB-0002',
    barcode: '7501055300029',
    name: 'Agua mineral 1.5L',
    category: 'Bebidas',
    brand: 'Coca-Cola',
    purchasePrice: 8,
    salePrice: 16,
    stock: 210,
    minStock: 50,
    status: 'activo',
    color: palette[0],
  },
  {
    id: '8',
    code: 'LAC-0015',
    barcode: '7790040991033',
    name: 'Yogur natural 500g',
    category: 'Lácteos',
    brand: 'La Serenísima',
    purchasePrice: 21.5,
    salePrice: 34,
    stock: 17,
    minStock: 18,
    status: 'inactivo',
    color: palette[2],
  },
]

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(value)
}

export type StockLevel = 'out' | 'low' | 'ok'

export function stockLevel(product: Pick<Product, 'stock' | 'minStock'>): StockLevel {
  if (product.stock <= 0) return 'out'
  if (product.stock < product.minStock) return 'low'
  return 'ok'
}
