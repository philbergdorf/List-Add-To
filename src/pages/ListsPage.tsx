import { useState, useRef, useCallback, useEffect } from 'react'
import { ShoppingBasket, Plus, Circle, CircleCheckBig, ChevronDown, ChevronUp, ChevronRight, EllipsisVertical, UserPlus, Minus, Trash, Check } from 'lucide-react'
import { allProducts, productSectionMap, sectionIconMap, categorySections } from '@/pages/AddProductPage'
import type { Product, ShoppingList } from '@/lib/types'

const sectionOrder = ['Vorräte & Haushalt', ...categorySections.map((s) => s.title)]

function ListsPage({ onAddProduct, quantities, onIncrement, onRemove, lists, activeListId, onSwitchList, displayListName }: {
  onAddProduct: () => void
  quantities: Record<string, number>
  onIncrement: (id: string) => void
  onRemove: (id: string) => void
  lists: ShoppingList[]
  activeListId: string
  onSwitchList: (id: string) => void
  displayListName: string
}) {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [pending, setPending] = useState<Set<string>>(new Set())
  const [showErledigt, setShowErledigt] = useState(false)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [listPickerOpen, setListPickerOpen] = useState(false)
  const moveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastScrollTop = useRef(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const top = el.scrollTop
      if (top > lastScrollTop.current + 5) setCollapsed(true)
      else if (top < lastScrollTop.current - 5) setCollapsed(false)
      lastScrollTop.current = top
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const flushPending = useCallback(() => {
    setPending((p) => {
      if (p.size === 0) return p
      setChecked((prev) => {
        const next = new Set(prev)
        for (const id of p) next.add(id)
        return next
      })
      return new Set()
    })
  }, [])

  const toggleCheck = (id: string) => {
    navigator.vibrate?.(10)
    // Unchecking: move back immediately
    if (checked.has(id)) {
      setChecked((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
      return
    }
    // Checking: if already pending, just toggle it off from pending
    if (pending.has(id)) {
      setPending((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
      return
    }
    // Add to pending (visually checked but stays in place)
    setPending((prev) => new Set(prev).add(id))
    // Reset the timer — flush after 1.5s of no new checks
    if (moveTimer.current) clearTimeout(moveTimer.current)
    moveTimer.current = setTimeout(flushPending, 1500)
  }

  const removeItem = (id: string) => {
    onRemove(id)
    setChecked((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    setSelectedItemId(null)
  }

  const clearChecked = () => {
    for (const id of checked) {
      onRemove(id)
    }
    setChecked(new Set())
  }

  const entries = Object.entries(quantities)
  const hasItems = entries.length > 0

  // Total price
  const totalPrice = entries.reduce((sum, [id, qty]) => {
    const p = allProducts.get(id)
    return sum + (p ? p.price * qty : 0)
  }, 0)

  // Group by section
  const grouped = new Map<string, { id: string; qty: number; product: Product }[]>()
  for (const [id, qty] of entries) {
    const product = allProducts.get(id)
    if (!product) continue
    const section = productSectionMap.get(id) || 'Sonstiges'
    if (!grouped.has(section)) grouped.set(section, [])
    grouped.get(section)!.push({ id, qty, product })
  }

  const sortedSections = [...grouped.entries()].sort(
    (a, b) => (sectionOrder.indexOf(a[0]) ?? 99) - (sectionOrder.indexOf(b[0]) ?? 99)
  )

  const uncheckedSections: [string, { id: string; qty: number; product: Product }[]][] = []
  const checkedItems: { id: string; qty: number; product: Product }[] = []

  for (const [section, items] of sortedSections) {
    // Pending items stay in their section (visually checked but not moved yet)
    const unchecked = items.filter((i) => !checked.has(i.id))
    const checkedInSection = items.filter((i) => checked.has(i.id) && !pending.has(i.id))
    if (unchecked.length > 0) uncheckedSections.push([section, unchecked])
    checkedItems.push(...checkedInSection)
  }

  const shareList = async () => {
    const activeListName = lists.find((l) => l.id === activeListId)?.name || 'Einkaufsliste'
    const lines = entries.map(([id, qty]) => {
      const p = allProducts.get(id)
      if (!p) return ''
      const note = notes[id]
      return `${qty > 1 ? qty + 'x ' : ''}${p.name}${note ? ` (${note})` : ''}`
    }).filter(Boolean)
    const text = lines.length > 0
      ? `${activeListName}:\n${lines.join('\n')}`
      : `${activeListName} (leer)`
    if (navigator.share) {
      await navigator.share({ title: activeListName, text })
    } else {
      await navigator.clipboard.writeText(text)
      alert('Liste in Zwischenablage kopiert!')
    }
  }

  const selectedProduct = selectedItemId ? allProducts.get(selectedItemId) : null
  const selectedQty = selectedItemId ? quantities[selectedItemId] || 0 : 0

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--color-bg)]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto pb-24">
        {/* Top bar: list name/selector + share */}
        <div className="flex items-center justify-between px-4 pt-3 pb-1">
          <div className="relative">
            {lists.length > 1 ? (
              <>
                <button
                  onClick={() => setListPickerOpen((v) => !v)}
                  className="flex items-center gap-1 text-[20px] font-bold text-[var(--color-text)]"
                >
                  {displayListName}
                  <ChevronDown size={18} color="var(--color-text-secondary)" />
                </button>
                {listPickerOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setListPickerOpen(false)} />
                    <div className="absolute left-0 top-full mt-1 z-50 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-[var(--color-border)] py-1 min-w-[180px]">
                      {lists.map((list) => (
                        <button
                          key={list.id}
                          onClick={() => { onSwitchList(list.id); setListPickerOpen(false) }}
                          className="flex items-center justify-between w-full px-4 py-2.5 text-[14px] text-[var(--color-text)] active:bg-[var(--color-bg)]"
                        >
                          {list.name}
                          {list.id === activeListId && <Check size={16} color="var(--color-primary)" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <h2 className="text-[20px] font-bold text-[var(--color-text)]">
                {displayListName}
              </h2>
            )}
          </div>
          <button
            onClick={shareList}
            className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-[var(--color-border)] text-[var(--color-primary)] text-[13px] font-medium active:bg-[var(--color-primary-light)] transition-colors"
          >
            <UserPlus size={15} strokeWidth={2} />
            Teilen
          </button>
        </div>

        {!hasItems ? (
          <div className="flex flex-col items-center px-8 pt-[20vh]">
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
        ) : (
        <>
        {uncheckedSections.map(([section, items]) => {
          const SectionIcon = sectionIconMap.get(section)
          return (
            <div key={section} className="mt-3">
              <h3 className="text-[13px] font-bold text-[var(--color-text)] uppercase tracking-wide px-4 mb-1.5 flex items-center gap-1.5">
                {SectionIcon && <SectionIcon size={14} />}
                {section} ({items.length})
              </h3>
              <div className="mx-4 bg-white rounded-xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                {items.map((item, i) => (
                  <div key={item.id}>
                    {i > 0 && <div className="border-t border-[var(--color-border)] ml-14" />}
                    <ShoppingListItem
                      product={item.product}
                      quantity={item.qty}
                      isChecked={pending.has(item.id)}
                      note={notes[item.id]}
                      onToggle={() => toggleCheck(item.id)}
                      onDetail={() => setSelectedItemId(item.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {checkedItems.length > 0 && (
          <div className="mt-4 mx-4">
            <div className="bg-white rounded-xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
              <div
                onClick={() => setShowErledigt((v) => !v)}
                className="flex items-center justify-between px-4 py-2.5 cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-bold text-[var(--color-text)]">
                    {checkedItems.length} erledigt
                  </span>
                  {showErledigt ? <ChevronUp size={14} color="var(--color-text-secondary)" /> : <ChevronDown size={14} color="var(--color-text-secondary)" />}
                </div>
                {showErledigt && (
                  <button
                    onClick={(e) => { e.stopPropagation(); clearChecked() }}
                    className="flex items-center gap-1 text-[12px] font-medium text-[var(--color-red)]"
                  >
                    <Trash size={12} />
                    Löschen
                  </button>
                )}
              </div>
              {showErledigt && checkedItems.map((item) => (
                <div key={item.id}>
                  <div className="border-t border-[var(--color-border)] ml-14" />
                  <ShoppingListItem
                    product={item.product}
                    quantity={item.qty}
                    isChecked={true}
                    note={notes[item.id]}
                    onToggle={() => toggleCheck(item.id)}
                    onDetail={() => setSelectedItemId(item.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Total price */}
        <div className="mx-4 mt-4 mb-24 flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-[var(--color-border)]">
          <span className="text-[14px] font-medium text-[var(--color-text-secondary)]">Gesamt</span>
          <span className="text-[18px] font-bold text-[var(--color-text)]">CHF {totalPrice.toFixed(2)}</span>
        </div>
        </>
        )}
      </div>

      {/* Add products button */}
      {hasItems && <div className="fixed bottom-20 left-0 right-0 flex justify-center z-40 pointer-events-none">
        <div className="max-w-[428px] w-full flex justify-center px-4 mb-3 pointer-events-none">
          <button
            onClick={onAddProduct}
            className={`bg-[var(--color-primary)] shadow-lg pointer-events-auto flex items-center justify-center transition-all duration-300 ease-in-out ${
              collapsed
                ? 'w-14 h-14 rounded-full'
                : 'h-14 px-5 rounded-full gap-2'
            }`}
          >
            <Plus size={22} color="white" strokeWidth={2.5} className="flex-shrink-0" />
            <span className={`text-white text-[15px] font-semibold whitespace-nowrap overflow-hidden transition-all duration-300 ${
              collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
            }`}>
              Produkte hinzufügen
            </span>
          </button>
        </div>
      </div>}

      {/* Bottom sheet */}
      {selectedItemId && selectedProduct && (
        <ItemDetailSheet
          product={selectedProduct}
          quantity={selectedQty}
          note={notes[selectedItemId] || ''}
          onClose={() => setSelectedItemId(null)}
          onNoteChange={(text) => setNotes((prev) => ({ ...prev, [selectedItemId]: text }))}
          onIncrement={() => onIncrement(selectedItemId)}
          onDecrement={() => {
            if (selectedQty > 1) onRemove(selectedItemId)
          }}
          onRemove={() => removeItem(selectedItemId)}
        />
      )}
    </div>
  )
}

function ShoppingListItem({ product, quantity, isChecked, note, onToggle, onDetail }: {
  product: Product
  quantity: number
  isChecked: boolean
  note?: string
  onToggle: () => void
  onDetail: () => void
}) {
  return (
    <div className="flex items-center px-3 py-3.5 gap-3">
      <button onClick={onToggle} className="flex-shrink-0 p-1">
        <div className={`transition-transform duration-200 ${isChecked ? 'scale-110' : 'scale-100'}`}>
          {isChecked ? (
            <CircleCheckBig size={26} color="var(--color-green)" className="animate-[checkPop_0.3s_ease-out]" />
          ) : (
            <Circle size={26} color="var(--color-text-tertiary)" />
          )}
        </div>
      </button>

      <div className="w-11 h-11 flex-shrink-0 rounded-lg overflow-hidden" onClick={onToggle}>
        {product.imageUrl ? (
          <img src={product.imageUrl} alt="" className="w-full h-full object-contain" />
        ) : (
          <div className="w-full h-full bg-[#E5E5EA]" />
        )}
      </div>

      <div className="flex-1 min-w-0" onClick={onToggle}>
        <p className={`text-[14px] font-medium leading-tight transition-all duration-300 ${isChecked ? 'line-through text-[var(--color-green)]' : 'text-[var(--color-text)]'}`}>
          {product.description}
        </p>
        {note ? (
          <p className="text-[12px] text-[var(--color-text-secondary)] mt-0.5 truncate">{note}</p>
        ) : (
          <p className="text-[12px] text-[var(--color-text-secondary)] mt-0.5">{product.unit}</p>
        )}
      </div>

      {quantity > 1 && (
        <span className="text-[12px] font-semibold text-[var(--color-text-secondary)] bg-[var(--color-bg)] px-2 py-0.5 rounded-full flex-shrink-0">
          x{quantity}
        </span>
      )}

      <span className={`text-[14px] font-bold flex-shrink-0 transition-all duration-300 ${isChecked ? 'line-through text-[var(--color-green)]' : 'text-[var(--color-text)]'}`}>
        {(product.price * quantity).toFixed(2)}
      </span>

      <button onClick={onDetail} className="flex-shrink-0 bg-[#F2F2F7] px-1.5 py-2 rounded-lg text-[var(--color-text-secondary)] active:bg-[var(--color-border)] transition-colors">
        <EllipsisVertical size={18} />
      </button>
    </div>
  )
}

function ItemDetailSheet({ product, quantity, note, onClose, onNoteChange, onIncrement, onDecrement, onRemove }: {
  product: Product
  quantity: number
  note: string
  onClose: () => void
  onNoteChange: (text: string) => void
  onIncrement: () => void
  onDecrement: () => void
  onRemove: () => void
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-[60]"
        onClick={onClose}
      />
      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-[60]">
        <div className="max-w-[428px] mx-auto bg-white rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-[var(--color-border)] rounded-full" />
          </div>

          {/* Product header — tappable for PDP */}
          <button className="flex items-center gap-3 px-5 pb-4 w-full text-left">
            <div className="w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt="" className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full bg-[#E5E5EA]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[17px] font-bold text-[var(--color-text)]">{product.description}</p>
              <p className="text-[13px] text-[var(--color-text-secondary)]">{product.unit} · CHF {product.price.toFixed(2)}</p>
            </div>
            <ChevronRight size={20} color="var(--color-text)" className="flex-shrink-0" />
          </button>

          <div className="border-t border-[var(--color-border)]" />

          {/* Note */}
          <div className="px-5 py-4">
            <label className="text-[13px] font-bold text-[var(--color-text)] uppercase tracking-wide">Notiz</label>
            <input
              type="text"
              value={note}
              onChange={(e) => onNoteChange(e.target.value)}
              placeholder="z.B. Bio, die grossen..."
              className="w-full mt-2 px-3 py-2.5 bg-[var(--color-bg)] rounded-xl text-[15px] text-[var(--color-text)] placeholder-[var(--color-text-tertiary)] outline-none border border-[var(--color-border)] focus:border-[var(--color-primary)]"
            />
          </div>

          <div className="border-t border-[var(--color-border)]" />

          {/* Quantity */}
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-[13px] font-bold text-[var(--color-text)] uppercase tracking-wide">Menge</span>
            <div className="flex items-center gap-3">
              <button
                onClick={quantity <= 1 ? onRemove : onDecrement}
                className="w-9 h-9 rounded-lg flex items-center justify-center border border-[var(--color-border)]"
              >
                {quantity <= 1 ? <Trash size={16} color="var(--color-text-secondary)" /> : <Minus size={16} color="var(--color-text-secondary)" />}
              </button>
              <span className="text-[17px] font-bold text-[var(--color-text)] w-6 text-center">{quantity}</span>
              <button
                onClick={onIncrement}
                className="w-9 h-9 rounded-lg flex items-center justify-center bg-[var(--color-green)]"
              >
                <Plus size={16} color="white" />
              </button>
            </div>
          </div>

          {/* Fertig button */}
          <div className="px-5 pt-2 pb-[calc(16px+env(safe-area-inset-bottom))]">
            <button
              onClick={onClose}
              className="w-full py-3 bg-[var(--color-primary)] text-white text-[15px] font-semibold rounded-full"
            >
              Fertig
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ListsPage
