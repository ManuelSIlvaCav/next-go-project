import { CategoriesApiResponse, ApiCategory, NavigationCategory, MainNavigationCategory } from './api-types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_PATH || 'http://localhost:8080'

export async function fetchCategories(): Promise<MainNavigationCategory[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`)
    }

    const data: CategoriesApiResponse = await response.json()
    return transformApiCategoriesToNavigation(data.data)
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

export function transformApiCategoriesToNavigation(apiCategories: ApiCategory[]): MainNavigationCategory[] {
  // Transform API categories to navigation structure
  const transformCategory = (apiCat: ApiCategory): NavigationCategory => ({
    id: apiCat.id,
    name: apiCat.name,
    slug: apiCat.slug || apiCat.name.toLowerCase().replace(/\s+/g, '-'),
    description: apiCat.description,
    parentId: apiCat.parent_id,
    children: apiCat.children.map(transformCategory),
  })

  // Convert root categories to main navigation categories
  return apiCategories
    .filter(cat => !cat.parent_id) // Only root categories
    .map(rootCat => ({
      id: rootCat.id,
      name: rootCat.name,
      slug: rootCat.slug || rootCat.name.toLowerCase().replace(/\s+/g, '-'),
      description: rootCat.description,
      subcategories: rootCat.children.map(transformCategory),
    }))
}