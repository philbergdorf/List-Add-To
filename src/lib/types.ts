type PageName = 'home' | 'angebote' | 'cumulus' | 'liste' | 'subitogo' | 'add-product'

type Product = {
  id: string
  name: string
  description: string
  tags: string[]
  price: number
  imageUrl: string
  unit: string
  unitPrice: string
  originalPrice?: number
  discountPercent?: number
}

type ShoppingList = {
  id: string
  name: string
  quantities: Record<string, number>
}

export type { PageName, Product, ShoppingList }
