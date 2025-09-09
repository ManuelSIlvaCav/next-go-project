export interface SubCategory {
  id: string
  name: string
  href: string
  count?: number
}

export interface Category {
  id: string
  name: string
  href: string
  subcategories: SubCategory[]
}

export interface MainCategory {
  id: string
  name: string
  icon: string
  defaultOpen: boolean
  subcategories: Category[]
}

export interface PetNavigationMenuProps {
  className?: string
}
