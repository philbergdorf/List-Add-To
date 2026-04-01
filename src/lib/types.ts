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

export type { PageName, Product }
