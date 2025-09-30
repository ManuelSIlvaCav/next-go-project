import { useQuery } from '@tanstack/react-query'
import { fetchCategories } from './api'
import { MainNavigationCategory } from './api-types'

export function useCategories() {
  return useQuery<MainNavigationCategory[], Error>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime in v4)
    retry: 2,
    refetchOnWindowFocus: false,
  })
}