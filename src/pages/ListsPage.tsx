import { useState } from 'react'
import { ShoppingBasket, Plus, Circle, CircleCheckBig, ChevronDown, ChevronUp } from 'lucide-react'
import { allProducts, productSectionMap, sectionIconMap, categorySections } from '@/pages/AddProductPage'
import type { Product } from '@/lib/types'

// Preserve category order from AddProductPage
const sectionOrder = ['Vorräte & Haushalt', ...categorySections.map((s) => s.title)]

function ListsPage({ onAddProduct, quantities }: {
  onAddProduct: () => void
  quantities: Record<string, number>
  onIncrement: (id: string) => void
  onRemove: (id: string) => void
}) {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [showErledigt, setShowErledigt] = useState(true)

  const toggleCheck = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const entries = Object.entries(quantities)
  const hasItems = entries.length > 0

  // Group by section
  const grouped = new Map<string, { id: string; qty: number; product: Product }[]>()
  for (const [id, qty] of entries) {
    const product = allProducts.get(id)
    if (!product) continue
    const section = productSectionMap.get(id) || 'Sonstiges'
    if (!grouped.has(section)) grouped.set(section, [])
    grouped.get(section)!.push({ id, qty, product })
  }

  // Sort sections by category order
  const sortedSections = [...grouped.entries()].sort(
    (a, b) => (sectionOrder.indexOf(a[0]) ?? 99) - (sectionOrder.indexOf(b[0]) ?? 99)
  )

  const uncheckedSections: [string, { id: string; qty: number; product: Product }[]][] = []
  const checkedItems: { id: string; qty: number; product: Product }[] = []

  for (const [section, items] of sortedSections) {
    const unchecked = items.filter((i) => !checked.has(i.id))
    const checkedInSection = items.filter((i) => checked.has(i.id))
    if (unchecked.length > 0) uncheckedSections.push([section, unchecked])
    checkedItems.push(...checkedInSection)
  }

  if (!hasItems) {
    return (
      <div className="flex-1 flex flex-col items-center px-8 pt-[25vh]">
        <div className="w-24 h-24 bg-[#FFF2E6] rounded-3xl flex items-center justify-center mb-6">
          <ShoppingBasket size={44} color="var(--color-primary)" strokeWidth={1.5} />
        </div>
        <h2 className="text-[20px] font-bold text-[var(--color-text)] text-center">
          Deine Liste ist leer
        </h2>
        <p className="text-[14px] text-[var(--color-text-secondary)] text-center mt-3 leading-relaxed max-w-[260px]">
          Füge Produkte hinzu, um deine Einkaufsliste zu erstellen.
        </p>
        <button
          onClick={onAddProduct}
          className="mt-8 flex items-center gap-2 px-7 py-3.5 bg-[var(--color-primary)] text-white text-[15px] font-semibold rounded-full shadow-sm"
        >
          <Plus size={20} strokeWidth={2.5} />
          Produkt hinzufügen
        </button>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-[var(--color-bg)]">
      <div className="flex-1 overflow-y-auto pb-24">
        {uncheckedSections.map(([section, items]) => {
          const SectionIcon = sectionIconMap.get(section)
          return (
            <div key={section} className="mt-3">
              <h3 className="text-[13px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide px-4 mb-1.5 flex items-center gap-1.5">
                {SectionIcon && <SectionIcon size={14} />}
                {section}
              </h3>
              <div className="mx-4 bg-white rounded-xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                {items.map((item, i) => (
                  <div key={item.id}>
                    {i > 0 && <div className="border-t border-[var(--color-border)] ml-14" />}
                    <ShoppingListItem
                      product={item.product}
                      quantity={item.qty}
                      isChecked={false}
                      onToggle={() => toggleCheck(item.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {/* Checked items */}
        {checkedItems.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setShowErledigt((v) => !v)}
              className="flex items-center gap-1.5 px-4 py-2 w-full text-left"
            >
              <span className="text-[13px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">
                Erledigt ({checkedItems.length})
              </span>
              {showErledigt ? <ChevronUp size={14} color="var(--color-text-secondary)" /> : <ChevronDown size={14} color="var(--color-text-secondary)" />}
            </button>
            {showErledigt && (
              <div className="mx-4 bg-white rounded-xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                {checkedItems.map((item, i) => (
                  <div key={item.id}>
                    {i > 0 && <div className="border-t border-[var(--color-border)] ml-14" />}
                    <ShoppingListItem
                      product={item.product}
                      quantity={item.qty}
                      isChecked={true}
                      onToggle={() => toggleCheck(item.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* FAB */}
      <div className="fixed bottom-20 left-0 right-0 flex justify-center z-40 pointer-events-none">
        <div className="max-w-[428px] w-full flex justify-end px-4 pointer-events-none">
          <button
            onClick={onAddProduct}
            className="w-14 h-14 bg-[var(--color-primary)] rounded-full flex items-center justify-center shadow-lg pointer-events-auto"
          >
            <Plus size={28} color="white" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  )
}

function ShoppingListItem({ product, quantity, isChecked, onToggle }: {
  product: Product
  quantity: number
  isChecked: boolean
  onToggle: () => void
}) {
  return (
    <div
      className={`flex items-center px-3 py-2.5 gap-3 ${isChecked ? 'opacity-45' : ''}`}
      onClick={onToggle}
    >
      {isChecked ? (
        <CircleCheckBig size={22} color="var(--color-primary)" className="flex-shrink-0" />
      ) : (
        <Circle size={22} color="var(--color-text-tertiary)" className="flex-shrink-0" />
      )}

      <div className="w-11 h-11 flex-shrink-0 rounded-lg overflow-hidden bg-[#FAFAFA]">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt="" className="w-full h-full object-contain" />
        ) : (
          <div className="w-full h-full bg-[#E5E5EA]" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-[14px] font-medium text-[var(--color-text)] leading-tight ${isChecked ? 'line-through' : ''}`}>
          {product.name}
        </p>
        <p className="text-[12px] text-[var(--color-text-secondary)] mt-0.5">
          {product.unit}
        </p>
      </div>

      {quantity > 1 && (
        <span className="text-[12px] font-semibold text-[var(--color-text-secondary)] bg-[var(--color-bg)] px-2 py-0.5 rounded-full flex-shrink-0">
          x{quantity}
        </span>
      )}

      <span className={`text-[14px] font-bold text-[var(--color-text)] flex-shrink-0 ${isChecked ? 'line-through' : ''}`}>
        {(product.price * quantity).toFixed(2)}
      </span>
    </div>
  )
}

export default ListsPage
