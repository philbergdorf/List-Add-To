import { useState, useRef, useEffect, useCallback, type ComponentType } from 'react'
import type { Product } from '@/lib/types'
import { Heart, Tag, Apple, Wheat, Milk, CupSoda, ListPlus, ScanBarcode, ChevronLeft, LayoutList, LayoutGrid, type LucideProps } from 'lucide-react'

type Section = { title: string; icon: ComponentType<LucideProps>; count: number; products: Product[] }

export const categorySections: Section[] = [
  {
    title: 'Früchte & Gemüse',
    icon: Apple,
    count: 23,
    products: [
      { id: '5', name: 'Äpfel Gala', description: 'Migros Bio · Äpfel Gala · Schweiz', tags: ['BIO', 'CH'], price: 3.90, imageUrl: 'https://image.migros.ch/d/2017-large/3b4b5cac73d2a0c701c130472124488317c25723.png', unit: '1 kg', unitPrice: '3.90/kg' },
      { id: '6', name: 'Karotten', description: 'Migros · Karotten · gewaschen', tags: ['CH'], price: 1.80, imageUrl: 'https://image.migros.ch/d/2017-large/8e74c797c830cfcbc8203453e524b1498fc797a5.png', unit: '500 g', unitPrice: '0.36/100g' },
      { id: '7', name: 'Bananen', description: 'M-Classic · Bananen · Fairtrade', tags: ['BIO'], price: 2.20, originalPrice: 2.60, discountPercent: 15, imageUrl: 'https://image.migros.ch/d/2017-large/5392688bcb7e06bcdb71e2c4bc60dc43acb8d246.png', unit: '1 kg', unitPrice: '2.20/kg' },
      { id: '19', name: 'Rispentomaten', description: 'Migros · Rispentomaten · Schweiz', tags: ['CH'], price: 3.20, imageUrl: 'https://image.migros.ch/d/2017-large/3155b84f4c01d2cb2da3acb12034026625472b0f.png', unit: '500 g', unitPrice: '0.64/100g' },
      { id: '20', name: 'Zitronen', description: 'Migros · Zitronen · Spanien', tags: [], price: 1.50, imageUrl: 'https://image.migros.ch/d/2017-large/d4daa7905c09c73af5aad30c5048b95edf4f1557.png', unit: '500 g', unitPrice: '0.30/100g' },
      { id: '29', name: 'Peperoni rot', description: 'Migros · Peperoni · rot · Schweiz', tags: ['CH'], price: 2.90, imageUrl: 'https://image.migros.ch/d/2017-large/399e5b032631dab3d289b74809adcb040f563ad6.png', unit: '500 g', unitPrice: '0.58/100g' },
      { id: '30', name: 'Gurke', description: 'Migros · Salatgurke · Schweiz', tags: ['CH'], price: 1.60, imageUrl: 'https://image.migros.ch/d/2017-large/ba56e864cd27654979cab9963cdbed213c7b6c48.png', unit: '1 Stück', unitPrice: '' },
      { id: '31', name: 'Avocado', description: 'Migros · Avocado · essreif', tags: [], price: 1.50, originalPrice: 1.90, discountPercent: 21, imageUrl: 'https://image.migros.ch/d/2017-large/2b5de843a56f782fc8bb14c45c25373357faeb74.png', unit: '1 Stück', unitPrice: '' },
    ],
  },
  {
    title: 'Brot & Backwaren',
    icon: Wheat,
    count: 18,
    products: [
      { id: '8', name: 'Butterzopf', description: 'Jowa · Butterzopf · IP-SUISSE', tags: ['NEU', 'CH'], price: 4.20, imageUrl: 'https://image.migros.ch/d/2017-large/4ca909344375633aa9e3a69c9d2811bfcd16b9b1.png', unit: '500 g', unitPrice: '0.84/100g' },
      { id: '9', name: 'Ruchbrot', description: 'M-Budget · Ruchbrot · Halbweiss', tags: ['CH'], price: 1.90, originalPrice: 2.40, discountPercent: 20, imageUrl: 'https://image.migros.ch/d/2017-large/0b93902ca4391528c1a2ce9ef7e2b55e559df417.png', unit: '500 g', unitPrice: '0.38/100g' },
      { id: '10', name: 'Vollkornbrot', description: 'M-Budget · Vollkornbrot · IP-SUISSE', tags: ['BIO', 'CH'], price: 3.10, imageUrl: 'https://image.migros.ch/d/2017-large/f1aa4948fb2ddf23feacb877c57cf0b7cbd1111f.png', unit: '400 g', unitPrice: '0.78/100g' },
      { id: '21', name: 'Weggli', description: 'Jowa · Weggli · 4 Stück', tags: ['CH'], price: 2.80, imageUrl: 'https://image.migros.ch/d/2017-large/d9593114e8dd491a87278ed89a5eb434936502ae.png', unit: '200 g', unitPrice: '1.40/100g' },
      { id: '32', name: 'Tessinerli', description: 'Jowa · Tessinerli · 4 Stück', tags: ['CH'], price: 3.40, imageUrl: 'https://image.migros.ch/d/2017-large/667f0f77d068de587b72f7d7d434deb1b4ee41ab.png', unit: '240 g', unitPrice: '1.42/100g' },
      { id: '33', name: 'Laugenbrezel', description: 'Jowa · Laugenbrezel · frisch', tags: ['NEU', 'CH'], price: 1.20, imageUrl: 'https://image.migros.ch/d/2017-large/043b278dd7e796af7622f0ea312c9171245f36e7.png', unit: '1 Stück', unitPrice: '' },
      { id: '34', name: 'Toastbrot', description: 'M-Classic · Toastbrot · Weizen', tags: ['CH'], price: 1.90, imageUrl: 'https://image.migros.ch/d/2017-large/131663c2a68f52a57de69d42963cddcc673227ea.png', unit: '500 g', unitPrice: '0.38/100g' },
      { id: '35', name: 'Knäckebrot', description: 'Wasa · Knäckebrot · Vollkorn', tags: [], price: 2.80, imageUrl: 'https://image.migros.ch/d/2017-large/3f76b2dea2944275c3a913c1b2eddc2c96b8207d.png', unit: '275 g', unitPrice: '1.02/100g' },
      { id: '36', name: 'Baguette', description: 'Jowa · Baguette · Weizen', tags: ['CH'], price: 1.80, imageUrl: 'https://image.migros.ch/d/2017-large/19639ec9257981825a177ab87e1a5c31df3a187e.png', unit: '280 g', unitPrice: '0.64/100g' },
    ],
  },
  {
    title: 'Milchprodukte & Eier',
    icon: Milk,
    count: 31,
    products: [
      { id: '11', name: 'Vollmilch', description: 'Valflora · Vollmilch · pasteurisiert', tags: ['CH'], price: 1.60, imageUrl: 'https://image.migros.ch/d/2017-large/7f46891098f810e2941bd47d6bff9ba22966e462.png', unit: '1 l', unitPrice: '1.60/l' },
      { id: '12', name: 'Freilandeier', description: 'M-Classic · Eier · Freilandhaltung 10er', tags: ['CH'], price: 4.80, imageUrl: 'https://image.migros.ch/d/2017-large/df114999b5b91c7cd71e1de658c1d1f6121116ff.png', unit: '10 Stück', unitPrice: '0.48/Stück' },
      { id: '13', name: 'Emmentaler', description: 'Migros · Emmentaler AOP · mild', tags: ['NEU', 'CH'], price: 4.30, originalPrice: 5.40, discountPercent: 20, imageUrl: 'https://image.migros.ch/d/2017-large/2525c34f4dc088d09ae3a182b05766c629c4db6c.png', unit: '250 g', unitPrice: '1.72/100g' },
      { id: '22', name: 'Naturjoghurt', description: 'Migros Bio · Naturjoghurt · 3.5% Fett', tags: ['BIO', 'CH'], price: 1.40, imageUrl: 'https://image.migros.ch/d/2017-large/2cab506e52c2b7456ca46dfbd273cbfdd34a6e24.png', unit: '500 g', unitPrice: '0.28/100g' },
      { id: '23', name: 'Gruyère', description: 'Migros · Gruyère AOP · rezent', tags: ['CH'], price: 6.20, imageUrl: 'https://image.migros.ch/d/2017-large/efb129e1d7c987c5eb1b567df9575faa087dedc9.png', unit: '250 g', unitPrice: '2.48/100g' },
      { id: '24', name: 'Butter', description: 'Die Butter · Schweizer Butter · Sauerrahm', tags: ['CH'], price: 3.30, imageUrl: 'https://image.migros.ch/d/2017-large/9487d457ef7f15ac914a926d8e17ca9280e57e38.png', unit: '250 g', unitPrice: '1.32/100g' },
      { id: '37', name: 'Mozzarella', description: 'Galbani · Mozzarella · aus Kuhmilch', tags: ['CH'], price: 2.10, imageUrl: 'https://image.migros.ch/d/2017-large/b823b0cef7a22e79abc9a9dde58b2d3fb70335fd.png', unit: '150 g', unitPrice: '1.40/100g' },
      { id: '38', name: 'Rahm', description: 'Valflora · Vollrahm · 35% Fett', tags: ['CH'], price: 2.40, imageUrl: 'https://image.migros.ch/d/2017-large/de06dd1684483a61d7a27ea460b146fe3d70e748.png', unit: '250 ml', unitPrice: '0.96/100ml' },
    ],
  },
  {
    title: 'Getränke',
    icon: CupSoda,
    count: 26,
    products: [
      { id: '14', name: 'Mineralwasser', description: 'Aproz · Mineralwasser · ohne Kohlensäure', tags: ['CH'], price: 0.85, imageUrl: 'https://image.migros.ch/d/2017-large/a31fc15f5283bca67e1b7849f15a6ba95fad9559.png', unit: '1.5 l', unitPrice: '0.57/l' },
      { id: '15', name: 'Orangensaft', description: 'Migros Bio · Orangensaft · 100% Frucht', tags: ['BIO'], price: 3.90, imageUrl: 'https://image.migros.ch/d/2017-large/f57be4f94221c945445cddab415b77e81c15d1c8.png', unit: '1 l', unitPrice: '3.90/l' },
      { id: '16', name: 'Eistee Pfirsich', description: 'Kult · Eistee · Pfirsich', tags: ['NEU'], price: 1.20, imageUrl: 'https://image.migros.ch/d/2017-large/af28ec070086f574d48d2506435b58750ed8de3b.png', unit: '500 ml', unitPrice: '0.24/100ml' },
      { id: '39', name: 'Apfelschorle', description: 'Ramseier · Apfelschorle · Schweiz', tags: ['CH'], price: 1.50, imageUrl: 'https://image.migros.ch/d/2017-large/7229e201de239519834c4d3136efcec831aec865.png', unit: '500 ml', unitPrice: '0.30/100ml' },
      { id: '40', name: 'Rivella rot', description: 'Rivella · Original · rot', tags: ['CH'], price: 1.40, originalPrice: 1.80, discountPercent: 22, imageUrl: 'https://image.migros.ch/d/2017-large/6212c78976ee32f5aa1992517adaa219494fbaf1.png', unit: '500 ml', unitPrice: '0.28/100ml' },
      { id: '41', name: 'Coca-Cola', description: 'Coca-Cola · Classic · Dose', tags: [], price: 1.30, imageUrl: 'https://image.migros.ch/d/2017-large/2385afbbfb8b5c1d6087812203b80a00d0c4d410.png', unit: '330 ml', unitPrice: '0.39/100ml' },
      { id: '42', name: 'Multivitaminsaft', description: 'M-Classic · Multivitaminsaft · 100% Frucht', tags: ['NEU'], price: 2.90, imageUrl: 'https://image.migros.ch/d/2017-large/f57be4f94221c945445cddab415b77e81c15d1c8.png', unit: '1 l', unitPrice: '2.90/l' },
    ],
  },
]

// Build dynamic sections
const favoriteProducts: Product[] = [
  { id: '1', name: 'Blätterteig', description: "Anna's Best · Blätterteig · ausgewallt und rund", tags: ['NEU', 'BIO', 'CH'], price: 1.52, originalPrice: 1.90, discountPercent: 20, imageUrl: 'https://image.migros.ch/d/2017-large/9dcfe6cd21b60d84e40ec3b1c23be753cbd44426.png', unit: '125 g', unitPrice: '1.22/100g' },
  { id: '2', name: 'Ketchup', description: 'Heinz · Tomato Ketchup · Original', tags: [], price: 3.90, imageUrl: 'https://image.migros.ch/d/2017-large/ae12094bea79ceb52a28e5339b0b07183740be5b.png', unit: '500 ml', unitPrice: '0.78/100ml' },
  { id: '4', name: 'Pouletbrust', description: 'Optigal · Pouletbrust · Schweiz', tags: ['NEU', 'CH'], price: 8.90, imageUrl: 'https://image.migros.ch/d/2017-large/013344c3cdbf8719d90bfba086f1fcd75bc934f1.png', unit: '350 g', unitPrice: '2.54/100g' },
  { id: '25', name: 'Olivenöl', description: 'Migros Bio · Olivenöl · extra vergine', tags: ['BIO'], price: 7.50, imageUrl: 'https://image.migros.ch/d/2017-large/93e7438d2fe7854ba6fe2ba84944d5424892ef70.png', unit: '500 ml', unitPrice: '1.50/100ml' },
  { id: '28', name: 'Basmatireis', description: 'M-Classic · Basmatireis · Langkorn', tags: [], price: 3.20, imageUrl: 'https://image.migros.ch/d/2017-large/bb9d91c26bee6a26a0ced636cf5c4dbbbdd7d67a.png', unit: '1 kg', unitPrice: '3.20/kg' },
  { id: '43', name: 'Konfitüre', description: 'Hero · Konfitüre · Erdbeere', tags: ['CH'], price: 3.40, imageUrl: 'https://image.migros.ch/d/2017-large/5b5aa1a86ba7fa7665df22b81325eb41386e8d1d.png', unit: '340 g', unitPrice: '1.00/100g' },
  { id: '44', name: 'Zahnpasta', description: 'Candida · Zahnpasta · Fresh Gel', tags: ['CH'], price: 2.10, imageUrl: 'https://image.migros.ch/d/2017-large/4a1f2ab88c47459e51bff50687f20e2c0e3e70de.png', unit: '125 ml', unitPrice: '1.68/100ml' },
]

const promotedProducts = categorySections.flatMap((s) =>
  s.products.filter((p) => p.discountPercent != null)
)
const sections: Section[] = [
  { title: 'Favoriten', icon: Heart, count: favoriteProducts.length, products: favoriteProducts },
  { title: 'Deine Aktionen', icon: Tag, count: promotedProducts.length, products: promotedProducts },
  ...categorySections,
]

// Product lookup by ID for use in other pages
export const allProducts = new Map<string, Product>(
  [...categorySections, { products: favoriteProducts }]
    .flatMap((s) => s.products)
    .map((p) => [p.id, p])
)

// Product ID → section title + icon for use in ListsPage
export const productSectionMap = new Map<string, string>()
export const sectionIconMap = new Map<string, ComponentType<LucideProps>>()
// Assign favorites to a general category
for (const p of favoriteProducts) {
  productSectionMap.set(p.id, 'Vorräte & Haushalt')
}
sectionIconMap.set('Vorräte & Haushalt', Heart)
for (const section of categorySections) {
  sectionIconMap.set(section.title, section.icon)
  for (const p of section.products) {
    if (!productSectionMap.has(p.id)) {
      productSectionMap.set(p.id, section.title)
    }
  }
}

function ProductImage({ src }: { src: string }) {
  if (!src) {
    return (
      <div className="w-20 h-20 flex-shrink-0 bg-[#E5E5EA] rounded-lg relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 80 80">
          <line x1="0" y1="0" x2="80" y2="80" stroke="#C7C7CC" strokeWidth="1" />
          <line x1="80" y1="0" x2="0" y2="80" stroke="#C7C7CC" strokeWidth="1" />
          <rect x="0" y="0" width="80" height="80" fill="none" stroke="#C7C7CC" strokeWidth="1" />
        </svg>
      </div>
    )
  }
  return (
    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-[#FAFAFA]">
      <img src={src} alt="" className="w-full h-full object-contain" />
    </div>
  )
}


function TrashIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

function MinusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function SwissFlagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <rect width="16" height="16" rx="2" fill="#FF0000" />
      <rect x="4" y="7" width="8" height="2" fill="white" />
      <rect x="7" y="4" width="2" height="8" fill="white" />
    </svg>
  )
}


function TagBadge({ tag }: { tag: string }) {
  if (tag === 'CH') return <SwissFlagIcon />
  if (tag === 'Kosher') return null
  const bg = tag === 'NEU' ? 'bg-[#007AFF]' : 'bg-[var(--color-green)]'
  return (
    <span className={`${bg} text-white text-[11px] font-bold px-1.5 py-0.5 rounded`}>
      {tag}
    </span>
  )
}


function QuantityControls({ quantity, onAdd, onIncrement, onRemove }: {
  quantity: number
  onAdd: () => void
  onIncrement: () => void
  onRemove: () => void
}) {
  if (quantity === 0) {
    return (
      <button
        onClick={onAdd}
        className="w-8 h-8 bg-[var(--color-primary)] rounded-md flex items-center justify-center"
      >
        <ListPlus size={16} color="white" />
      </button>
    )
  }
  return (
    <div className="flex flex-col items-center gap-0.5">
      <button
        onClick={onIncrement}
        className="w-8 h-8 bg-[var(--color-green)] rounded-md flex items-center justify-center"
      >
        <PlusIcon />
      </button>
      <span className="text-[13px] font-bold text-[var(--color-text)] text-center">
        {quantity}
      </span>
      <button
        onClick={onRemove}
        className="w-8 h-8 rounded-md flex items-center justify-center border border-[var(--color-border)]"
      >
        {quantity > 1 ? <MinusIcon /> : <TrashIcon />}
      </button>
    </div>
  )
}

function ProductRow({ product, quantity, onAdd, onIncrement, onRemove }: {
  product: Product
  quantity: number
  onAdd: () => void
  onIncrement: () => void
  onRemove: () => void
}) {
  return (
    <div className="flex items-start px-4 py-3">
      <ProductImage src={product.imageUrl} />

      <div className="flex-1 ml-3 min-w-0">
        <div className="flex items-baseline gap-2 whitespace-nowrap">
          {product.discountPercent != null && (
            <span className="bg-[var(--color-discount)] text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
              {product.discountPercent}%
            </span>
          )}
          <span className="text-[14px] font-bold text-[var(--color-text)]">
            {product.price.toFixed(2)}
          </span>
          {product.originalPrice != null && (
            <span className="text-[12px] text-[var(--color-text-secondary)] line-through">
              {product.originalPrice.toFixed(2)}
            </span>
          )}
          <span className="text-[12px] text-[var(--color-text-secondary)]">
            {product.unit}
          </span>
        </div>

        <p className="text-[14px] font-medium text-[var(--color-text)] mt-0.5 line-clamp-2 leading-snug">
          {product.description}
        </p>

        <div className="flex items-center gap-1.5 mt-1.5">
          {product.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 ml-2">
        <QuantityControls quantity={quantity} onAdd={onAdd} onIncrement={onIncrement} onRemove={onRemove} />
      </div>
    </div>
  )
}

function ProductCard({ product, quantity, onAdd, onIncrement, onRemove }: {
  product: Product
  quantity: number
  onAdd: () => void
  onIncrement: () => void
  onRemove: () => void
}) {
  return (
    <div className="flex items-stretch mx-4 my-1.5 bg-white rounded-xl shadow-[0_1px_8px_rgba(0,0,0,0.08)] border border-[var(--color-border)]/50 overflow-hidden">
      <div className="w-24 flex-shrink-0 bg-[#FAFAFA] flex items-center justify-center self-stretch">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt="" className="w-20 h-20 object-contain" />
        ) : (
          <div className="w-20 h-20 bg-[#E5E5EA] rounded-lg" />
        )}
      </div>

      <div className="flex-1 flex items-start p-3 min-w-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 whitespace-nowrap">
            {product.discountPercent != null && (
              <span className="bg-[var(--color-discount)] text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
                {product.discountPercent}%
              </span>
            )}
            <span className="text-[14px] font-bold text-[var(--color-text)]">
              {product.price.toFixed(2)}
            </span>
            {product.originalPrice != null && (
              <span className="text-[12px] text-[var(--color-text-secondary)] line-through">
                {product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-[12px] text-[var(--color-text-secondary)]">
              {product.unit}
            </span>
          </div>

          <p className="text-[14px] font-medium text-[var(--color-text)] mt-0.5 line-clamp-2 leading-snug">
            {product.description}
          </p>

          <div className="flex items-center gap-1.5 mt-1.5">
            {product.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
        </div>

        <div className="flex-shrink-0 ml-2">
          <QuantityControls quantity={quantity} onAdd={onAdd} onIncrement={onIncrement} onRemove={onRemove} />
        </div>
      </div>
    </div>
  )
}

const COLLAPSED_COUNT = 5

function AddProductPage({ onBack, quantities, onAdd, onIncrement, onRemove }: {
  onBack: () => void
  quantities: Record<string, number>
  onAdd: (id: string) => void
  onIncrement: (id: string) => void
  onRemove: (id: string) => void
}) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [promoFilter] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'card'>('card')
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const chipBarRef = useRef<HTMLDivElement>(null)
  const isScrollingTo = useRef(false)

  const scrollToSection = (title: string) => {
    const el = sectionRefs.current[title]
    const container = scrollRef.current
    if (!el || !container) return
    isScrollingTo.current = true
    setActiveSection(title)
    container.scrollTo({ top: el.offsetTop - container.offsetTop, behavior: 'smooth' })
    setTimeout(() => { isScrollingTo.current = false }, 500)
  }

  const handleScroll = useCallback(() => {
    if (isScrollingTo.current) return
    const container = scrollRef.current
    if (!container) return
    const scrollTop = container.scrollTop + 10
    let current = sections[0].title
    for (const section of sections) {
      const el = sectionRefs.current[section.title]
      if (el && el.offsetTop - container.offsetTop <= scrollTop) {
        current = section.title
      }
    }
    setActiveSection(current)
  }, [])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    const chip = chipBarRef.current?.querySelector(`[data-section="${activeSection}"]`) as HTMLElement | null
    if (chip && chipBarRef.current) {
      const bar = chipBarRef.current
      const left = chip.offsetLeft - bar.offsetWidth / 2 + chip.offsetWidth / 2
      bar.scrollTo({ left, behavior: 'smooth' })
    }
  }, [activeSection])

  const filteredSections = promoFilter
    ? sections
        .map((s) => ({ ...s, products: s.products.filter((p) => p.discountPercent != null) }))
        .filter((s) => s.products.length > 0)
    : sections

  const addProduct = (id: string) => onAdd(id)
  const incrementProduct = (id: string) => onIncrement(id)
  const removeProduct = (id: string) => onRemove(id)

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <header className="px-4 pt-[env(safe-area-inset-top)]">
        <div className="h-11 flex items-center justify-center relative">
          <button
            onClick={onBack}
            className="absolute -left-2 flex items-center text-[var(--color-primary)] text-[17px]"
          >
            <ChevronLeft size={28} strokeWidth={2.5} />
            <span>Zurück</span>
          </button>
          <h1 className="text-[17px] font-semibold text-[var(--color-text)]">Add product</h1>
          <button
            onClick={() => setViewMode((v) => v === 'list' ? 'card' : 'list')}
            className="absolute right-0 text-[var(--color-text-secondary)]"
          >
            {viewMode === 'list' ? <LayoutGrid size={22} /> : <LayoutList size={22} />}
          </button>
        </div>
      </header>

      {/* Search bar */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center bg-[#F2F2F7] rounded-xl border border-[var(--color-border)] px-3 h-[44px]">
          <span className="text-[var(--color-text-secondary)] text-[15px] flex-1">Produkt suchen...</span>
          <button className="flex-shrink-0">
            <ScanBarcode size={22} color="var(--color-text-secondary)" />
          </button>
        </div>
      </div>

      {/* Section chip bar */}
      <div
        ref={chipBarRef}
        className="flex gap-2 px-4 py-2 overflow-x-auto no-scrollbar border-b border-[var(--color-border)]"
      >
        {filteredSections.map((section) => {
          const isActive = activeSection === section.title
          return (
            <button
              key={section.title}
              data-section={section.title}
              onClick={() => scrollToSection(section.title)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors flex items-center gap-1 whitespace-nowrap ${
                isActive
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[#F2F2F7] text-[var(--color-text)]'
              }`}
            >
              <section.icon size={14} />{section.title}
            </button>
          )
        })}
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto pb-20">
        {filteredSections.map((section, i) => {
          const isExpanded = expandedSections[section.title] || false
          const visibleProducts = isExpanded ? section.products : section.products.slice(0, COLLAPSED_COUNT)
          const hiddenCount = section.products.length - COLLAPSED_COUNT

          return (
            <div key={section.title} ref={(el) => { sectionRefs.current[section.title] = el }}>
              {i > 0 && viewMode === 'list' && <div className="border-t border-[var(--color-border)]" />}
              <div className="pt-4">
                <h2 className="text-[17px] font-bold text-[var(--color-text)] px-4 mb-1 flex items-center gap-1.5"><section.icon size={18} /> {section.title}</h2>
                {viewMode === 'list' ? (
                  <div className="divide-y divide-[var(--color-border)]">
                    {visibleProducts.map((product) => (
                      <ProductRow
                        key={product.id}
                        product={product}
                        quantity={quantities[product.id] || 0}
                        onAdd={() => addProduct(product.id)}
                        onIncrement={() => incrementProduct(product.id)}
                        onRemove={() => removeProduct(product.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-1">
                    {visibleProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        quantity={quantities[product.id] || 0}
                        onAdd={() => addProduct(product.id)}
                        onIncrement={() => incrementProduct(product.id)}
                        onRemove={() => removeProduct(product.id)}
                      />
                    ))}
                  </div>
                )}
                {!isExpanded && hiddenCount > 0 && (
                  <div className="px-4 py-3">
                    <button
                      onClick={() => setExpandedSections((prev) => ({ ...prev, [section.title]: true }))}
                      className="w-full h-11 rounded-full border-2 border-[var(--color-primary)] text-[var(--color-primary)] text-[14px] font-semibold"
                    >
                      Alle anzeigen (+{hiddenCount})
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AddProductPage
