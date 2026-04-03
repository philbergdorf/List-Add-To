import { useState } from 'react'
import { App } from 'konsta/react'
import HomePage from '@/pages/HomePage'
import ListsPage from '@/pages/ListsPage'
import AddProductPage from '@/pages/AddProductPage'
import type { PageName, ShoppingList } from '@/lib/types'
import { Percent, Barcode, ClipboardList, EllipsisVertical, Plus, Pencil, Trash2, Store, Truck } from 'lucide-react'

function MigrosIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <text x="3" y="19" fontSize="20" fontWeight="bold" fontFamily="system-ui" fill="currentColor">M</text>
    </svg>
  )
}

function ListeBadgeIcon({ count }: { count?: number }) {
  return (
    <div className="relative">
      <ClipboardList size={24} />
      {(count ?? 0) > 0 && (
        <span className="absolute -top-1.5 -right-2.5 bg-[var(--color-primary)] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{count}</span>
      )}
    </div>
  )
}

function SubitoGoIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <text x="2" y="18" fontSize="16" fontWeight="bold" fontStyle="italic" fontFamily="system-ui" fill="currentColor">Go</text>
    </svg>
  )
}

const tabs = [
  { id: 'home' as PageName, label: 'Home', icon: MigrosIcon },
  { id: 'angebote' as PageName, label: 'Angebote', icon: () => <Percent size={24} /> },
  { id: 'cumulus' as PageName, label: 'Cumulus', icon: () => <Barcode size={24} /> },
  { id: 'liste' as PageName, label: 'Liste', icon: null },
  { id: 'subitogo' as PageName, label: 'subitoGo', icon: SubitoGoIcon },
] as const

function Header({ title, onMenuAction, showShoppingToggle, canEditList = true, shoppingMode, onShoppingModeChange }: {
  title: string
  onMenuAction?: (action: string) => void
  showShoppingToggle?: boolean
  canEditList?: boolean
  shoppingMode?: 'laden' | 'online'
  onShoppingModeChange?: (mode: 'laden' | 'online') => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const setShoppingMode = onShoppingModeChange || (() => {})

  return (
    <header className="bg-white border-b border-[var(--color-border)] px-4 pt-[env(safe-area-inset-top)] relative">
      <div className={`flex items-center justify-between ${showShoppingToggle ? 'h-12' : 'h-11'}`}>
        {showShoppingToggle ? (
          <button
            className="flex items-center gap-2.5"
            onClick={() => setShoppingMode(shoppingMode === 'laden' ? 'online' : 'laden')}
          >
            <div className="flex bg-[var(--color-bg)] rounded-full p-[2px] border border-[var(--color-border)]">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                  shoppingMode === 'laden'
                    ? 'bg-[var(--color-primary)] text-white shadow-sm'
                    : 'text-[var(--color-text-secondary)]'
                }`}
              >
                <Store size={20} />
              </div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                  shoppingMode === 'online'
                    ? 'bg-[var(--color-primary)] text-white shadow-sm'
                    : 'text-[var(--color-text-secondary)]'
                }`}
              >
                <Truck size={20} />
              </div>
            </div>
            <span className="text-[16px] font-bold text-[var(--color-text)]">
              {shoppingMode === 'laden' ? 'Im Laden einkaufen' : 'Online einkaufen'}
            </span>
          </button>
        ) : (
          <h1 className="text-[22px] font-bold text-[var(--color-text)]">{title}</h1>
        )}
        {onMenuAction && (
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="text-[var(--color-text-secondary)] p-1"
          >
            <EllipsisVertical size={22} />
          </button>
        )}
      </div>
      {menuOpen && onMenuAction && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-4 top-full mt-1 z-50 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-[var(--color-border)] py-1 min-w-[200px]">
            <button
              onClick={() => { setMenuOpen(false); onMenuAction('new') }}
              className="flex items-center gap-3 w-full px-4 py-3 text-left text-[15px] text-[var(--color-text)] active:bg-[var(--color-bg)]"
            >
              <Plus size={18} color="var(--color-text-secondary)" />
              Neue Liste
            </button>
            {canEditList && (
              <>
                <div className="border-t border-[var(--color-border)]" />
                <button
                  onClick={() => { setMenuOpen(false); onMenuAction('rename') }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-left text-[15px] text-[var(--color-text)] active:bg-[var(--color-bg)]"
                >
                  <Pencil size={18} color="var(--color-text-secondary)" />
                  Liste umbenennen
                </button>
                <div className="border-t border-[var(--color-border)]" />
                <button
                  onClick={() => { setMenuOpen(false); onMenuAction('delete') }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-left text-[15px] text-[var(--color-red)] active:bg-[var(--color-bg)]"
                >
                  <Trash2 size={18} />
                  Liste löschen
                </button>
              </>
            )}
          </div>
        </>
      )}
    </header>
  )
}

function TabBar({ activeTab, onTabChange, itemCount }: { activeTab: PageName; onTabChange: (tab: PageName) => void; itemCount: number }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-[428px] mx-auto bg-white/80 backdrop-blur-md border-t border-[var(--color-border)] flex pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center pt-2 pb-1 ${isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'}`}
            >
              {tab.id === 'liste' ? <ListeBadgeIcon count={itemCount} /> : tab.icon ? <tab.icon /> : null}
              <span className="text-[10px] mt-1">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

function NameSheet({ title, placeholder, initialValue, buttonLabel, onSubmit, onClose }: {
  title: string
  placeholder: string
  initialValue: string
  buttonLabel: string
  onSubmit: (name: string) => void
  onClose: () => void
}) {
  const [value, setValue] = useState(initialValue)
  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-[428px] mx-auto bg-white rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-[var(--color-border)] rounded-full" />
          </div>
          <div className="px-5 pb-2">
            <h3 className="text-[17px] font-bold text-[var(--color-text)]">{title}</h3>
          </div>
          <div className="px-5 pb-4">
            <div className="relative flex items-center">
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                autoFocus
                className="w-full px-3 py-2.5 pr-9 bg-[var(--color-bg)] rounded-xl text-[15px] text-[var(--color-text)] placeholder-[var(--color-text-tertiary)] outline-none border border-[var(--color-border)] focus:border-[var(--color-primary)]"
                onKeyDown={(e) => { if (e.key === 'Enter' && value.trim()) onSubmit(value.trim()) }}
              />
              {value && (
                <button
                  onClick={() => setValue('')}
                  className="absolute right-2.5 w-5 h-5 bg-[var(--color-text-tertiary)] rounded-full flex items-center justify-center"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" stroke="white" strokeWidth="1.8" strokeLinecap="round"><line x1="2" y1="2" x2="8" y2="8" /><line x1="8" y1="2" x2="2" y2="8" /></svg>
                </button>
              )}
            </div>
          </div>
          <div className="px-5 pb-[calc(16px+env(safe-area-inset-bottom))]">
            <button
              onClick={() => value.trim() && onSubmit(value.trim())}
              disabled={!value.trim()}
              className="w-full py-3 bg-[var(--color-primary)] text-white text-[15px] font-semibold rounded-full disabled:opacity-40"
            >
              {buttonLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

let nextListId = 2

function ListAddToApp() {
  const [currentPage, setCurrentPage] = useState<PageName>('liste')
  const [shoppingMode, setShoppingMode] = useState<'laden' | 'online'>('laden')
  const [lists, setLists] = useState<ShoppingList[]>([
    { id: '1', name: 'Einkaufsliste', quantities: {} }
  ])
  const [activeListId, setActiveListId] = useState('1')
  const [nameSheet, setNameSheet] = useState<{ mode: 'new' | 'rename'; defaultName?: string } | null>(null)

  const activeList = lists.find((l) => l.id === activeListId) || lists[0]
  const isDefaultList = activeList.id === '1'
  const displayListName = shoppingMode === 'online' && isDefaultList ? 'Warenkorb' : activeList.name

  const updateActiveQuantities = (fn: (prev: Record<string, number>) => Record<string, number>) => {
    setLists((prev) => prev.map((l) =>
      l.id === activeListId ? { ...l, quantities: fn(l.quantities) } : l
    ))
  }

  const addProduct = (id: string) => {
    updateActiveQuantities((prev) => ({ ...prev, [id]: 1 }))
  }
  const incrementProduct = (id: string) => {
    updateActiveQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
  }
  const removeProduct = (id: string) => {
    updateActiveQuantities((prev) => {
      const next = { ...prev }
      if (next[id] <= 1) {
        delete next[id]
      } else {
        next[id] -= 1
      }
      return next
    })
  }

  const handleMenuAction = (action: string) => {
    if (action === 'new') {
      setNameSheet({ mode: 'new', defaultName: `Einkaufsliste ${lists.length + 1}` })
    } else if (action === 'rename') {
      setNameSheet({ mode: 'rename' })
    } else if (action === 'delete') {
      if (lists.length <= 1) return
      setLists((prev) => {
        const next = prev.filter((l) => l.id !== activeListId)
        setActiveListId(next[0].id)
        return next
      })
    }
  }

  const handleNameSubmit = (name: string) => {
    if (nameSheet?.mode === 'new') {
      const id = String(nextListId++)
      setLists((prev) => [...prev, { id, name, quantities: {} }])
      setActiveListId(id)
    } else if (nameSheet?.mode === 'rename') {
      setLists((prev) => prev.map((l) =>
        l.id === activeListId ? { ...l, name } : l
      ))
    }
    setNameSheet(null)
  }

  const itemCount = Object.keys(activeList.quantities).length
  const headerTitle = currentPage === 'liste' ? activeList.name : (
    { home: 'Home', angebote: 'Angebote', cumulus: 'Cumulus', subitogo: 'subitoGo', 'add-product': 'Add product' } as Record<string, string>
  )[currentPage] || ''

  return (
    <App theme="ios" className="max-w-[428px] mx-auto !h-[100dvh]">
      <div className="flex flex-col h-full">
        {currentPage === 'add-product' ? (
          <AddProductPage onBack={() => setCurrentPage('liste')} quantities={activeList.quantities} onAdd={addProduct} onIncrement={incrementProduct} onRemove={removeProduct} />
        ) : (
          <>
            <Header
              title={headerTitle}
              onMenuAction={currentPage === 'liste' ? handleMenuAction : undefined}
              showShoppingToggle={currentPage === 'liste'}
              canEditList={!isDefaultList}
              shoppingMode={shoppingMode}
              onShoppingModeChange={setShoppingMode}
            />
            {currentPage === 'liste' ? (
              <ListsPage
                onAddProduct={() => setCurrentPage('add-product')}
                quantities={activeList.quantities}
                onIncrement={incrementProduct}
                onRemove={removeProduct}
                lists={lists}
                activeListId={activeListId}
                displayListName={displayListName}
                onSwitchList={setActiveListId}
              />
            ) : (
              <div className="flex-1 overflow-y-auto pb-20">
                {currentPage === 'home' && <HomePage />}
                {currentPage === 'angebote' && <HomePage />}
                {currentPage === 'cumulus' && <HomePage />}
                {currentPage === 'subitogo' && <HomePage />}
              </div>
            )}
          </>
        )}
        <TabBar activeTab={currentPage} onTabChange={setCurrentPage} itemCount={itemCount} />
      </div>

      {nameSheet && (
        <NameSheet
          title={nameSheet.mode === 'new' ? 'Neue Liste erstellen' : 'Liste umbenennen'}
          placeholder="Listenname"
          initialValue={nameSheet.mode === 'rename' ? activeList.name : (nameSheet.defaultName || '')}
          buttonLabel={nameSheet.mode === 'new' ? 'Erstellen' : 'Speichern'}
          onSubmit={handleNameSubmit}
          onClose={() => setNameSheet(null)}
        />
      )}
    </App>
  )
}

export default ListAddToApp
