'use client'

import * as React from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/jeralpos/button'
import { Modal } from '@/components/jeralpos/modal'
import { ProductGrid } from './product-grid'
import { CartPanel } from './cart-panel'
import { PaymentModal } from './payment-modal'
import {
  customers as initialCustomers,
  computeTotals,
  formatCurrency,
  FINAL_CONSUMER,
  type CartItem,
  type Customer,
  type PaymentMethodId,
  type Product,
} from './mock-data'

export function Ventas() {
  const [items, setItems] = React.useState<CartItem[]>([])
  const [customers, setCustomers] = React.useState<Customer[]>(initialCustomers)
  const [customer, setCustomer] = React.useState<Customer>(FINAL_CONSUMER)
  const [payment, setPayment] = React.useState<PaymentMethodId | null>('efectivo')
  const [payOpen, setPayOpen] = React.useState(false)
  const [successOpen, setSuccessOpen] = React.useState(false)
  const [savedOpen, setSavedOpen] = React.useState(false)

  const totals = React.useMemo(() => computeTotals(items), [items])

  const addProduct = React.useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id)
      if (existing) {
        if (existing.quantity >= product.stock) return prev
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        )
      }
      return [...prev, { product, quantity: 1, discount: 0 }]
    })
  }, [])

  const changeQuantity = React.useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.product.id !== id) return i
        const clamped = Math.max(1, Math.min(quantity, i.product.stock))
        return { ...i, quantity: clamped }
      }),
    )
  }, [])

  const changeDiscount = React.useCallback((id: string, discount: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === id
          ? { ...i, discount: Math.max(0, Math.min(discount, i.product.salePrice * i.quantity)) }
          : i,
      ),
    )
  }, [])

  const removeItem = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== id))
  }, [])

  const resetSale = React.useCallback(() => {
    setItems([])
    setCustomer(FINAL_CONSUMER)
    setPayment('efectivo')
  }, [])

  function handleCreateCustomer(c: Customer) {
    setCustomers((prev) => [c, ...prev])
    setCustomer(c)
  }

  function confirmPayment() {
    setPayOpen(false)
    setSuccessOpen(true)
  }

  function finishSale() {
    setSuccessOpen(false)
    resetSale()
  }

  function saveSale() {
    setSavedOpen(true)
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 lg:flex-row">
      <section
        aria-label="Productos"
        className="min-h-0 flex-1 rounded-2xl border border-border bg-background p-4"
      >
        <ProductGrid onAdd={addProduct} />
      </section>

      <aside
        aria-label="Carrito de venta"
        className="flex min-h-0 shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-card lg:w-[24rem] xl:w-[26rem]"
      >
        <CartPanel
          items={items}
          totals={totals}
          customer={customer}
          customers={customers}
          onSelectCustomer={setCustomer}
          onCreateCustomer={handleCreateCustomer}
          payment={payment}
          onSelectPayment={setPayment}
          onChangeQuantity={changeQuantity}
          onChangeDiscount={changeDiscount}
          onRemove={removeItem}
          onCharge={() => setPayOpen(true)}
          onSave={saveSale}
          onCancel={resetSale}
        />
      </aside>

      <PaymentModal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        onConfirm={confirmPayment}
        totals={totals}
        customer={customer}
        payment={payment}
      />

      <Modal
        open={successOpen}
        onClose={finishSale}
        title="Venta completada"
        footer={
          <Button variant="success" onClick={finishSale} className="w-full">
            Nueva venta
          </Button>
        }
      >
        <div className="flex flex-col items-center gap-3 py-2 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-success-muted text-success">
            <CheckCircle2 className="size-8" />
          </span>
          <div>
            <p className="text-2xl font-bold tabular-nums">{formatCurrency(totals.total)}</p>
            <p className="text-sm text-muted-foreground">
              Cobrado a {customer.name}. El ticket está listo para imprimirse.
            </p>
          </div>
        </div>
      </Modal>

      <Modal
        open={savedOpen}
        onClose={() => setSavedOpen(false)}
        title="Venta guardada"
        description="La venta quedó en espera y puedes retomarla más tarde."
        footer={
          <Button onClick={() => setSavedOpen(false)} className="w-full">
            Entendido
          </Button>
        }
      />
    </div>
  )
}
