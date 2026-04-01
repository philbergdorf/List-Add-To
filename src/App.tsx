import { useState } from 'react'
import { App } from 'konsta/react'
import HomePage from '@/pages/HomePage'
import ListsPage from '@/pages/ListsPage'
import AddProductPage from '@/pages/AddProductPage'
import type { PageName } from '@/lib/types'
import { Percent, Barcode, ClipboardList, User, Share2, EllipsisVertical } from 'lucide-react'

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

function Header({ title }: { title: string }) {
  return (
    <header className="bg-white border-b border-[var(--color-border)] px-4 pt-[env(safe-area-inset-top)]">
      <div className="h-11 flex items-center justify-between">
        <h1 className="text-[22px] font-bold text-[var(--color-text)]">{title}</h1>
        <div className="flex items-center gap-3">
          <button className="text-[var(--color-text-secondary)]">
            <Share2 size={22} />
          </button>
          <button className="text-[var(--color-text-secondary)]">
            <EllipsisVertical size={22} />
          </button>
        </div>
      </div>
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

const pageTitles: Record<PageName, string> = {
  home: 'Home',
  angebote: 'Angebote',
  cumulus: 'Cumulus',
  liste: 'Liste',
  subitogo: 'subitoGo',
  'add-product': 'Add product',
}

function ListAddToApp() {
  const [currentPage, setCurrentPage] = useState<PageName>('liste')
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const addProduct = (id: string) => {
    setQuantities((prev) => ({ ...prev, [id]: 1 }))
  }
  const incrementProduct = (id: string) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
  }
  const removeProduct = (id: string) => {
    setQuantities((prev) => {
      const next = { ...prev }
      if (next[id] <= 1) {
        delete next[id]
      } else {
        next[id] -= 1
      }
      return next
    })
  }

  const itemCount = Object.keys(quantities).length

  return (
    <App theme="ios" className="max-w-[428px] mx-auto !h-[100dvh]">
      <div className="flex flex-col h-full">
        {currentPage === 'add-product' ? (
          <AddProductPage onBack={() => setCurrentPage('liste')} quantities={quantities} onAdd={addProduct} onIncrement={incrementProduct} onRemove={removeProduct} />
        ) : (
          <>
            <Header title={pageTitles[currentPage]} />
            <div className="flex-1 overflow-y-auto pb-20">
              {currentPage === 'home' && <HomePage />}
              {currentPage === 'angebote' && <HomePage />}
              {currentPage === 'cumulus' && <HomePage />}
              {currentPage === 'liste' && <ListsPage onAddProduct={() => setCurrentPage('add-product')} quantities={quantities} onIncrement={incrementProduct} onRemove={removeProduct} />}
              {currentPage === 'subitogo' && <HomePage />}
            </div>
          </>
        )}
        <TabBar activeTab={currentPage} onTabChange={setCurrentPage} itemCount={itemCount} />
      </div>
    </App>
  )
}

export default ListAddToApp
