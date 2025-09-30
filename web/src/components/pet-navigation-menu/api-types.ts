// API Response types based on backend structure
export interface ApiCategory {
  id: string
  name: string
  slug: string
  description: string
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
  parent_id: string
  parent: ApiCategory | null
  children_ids: string[]
  children: ApiCategory[]
}

export interface CategoriesApiResponse {
  data: ApiCategory[]
}

// Client-side types for the navigation component
export interface NavigationCategory {
  id: string
  name: string
  slug: string
  description: string
  parentId: string
  children: NavigationCategory[]
}

export interface MainNavigationCategory {
  id: string
  name: string
  slug: string
  description: string
  subcategories: NavigationCategory[]
}

export interface PetNavigationMenuProps {
  className?: string
}