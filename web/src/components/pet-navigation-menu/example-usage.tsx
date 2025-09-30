// Example usage of the updated PetNavigationMenu component

import { PetNavigationMenu } from '@/components/pet-navigation-menu'

export default function ExamplePage() {
  return (
    <div>
      {/* The component now automatically fetches categories from the backend API */}
      <PetNavigationMenu className="border-b" />
      
      {/* Rest of your page content */}
      <main className="container mx-auto py-8">
        <h1>Welcome to our marketplace</h1>
        <p>Browse categories above to find what you need!</p>
      </main>
    </div>
  )
}

/*
The component now:
1. Fetches categories from GET /categories endpoint
2. Automatically handles loading states
3. Displays error messages if API fails
4. Transforms the API response to work with existing UI components
5. Uses TanStack Query for caching and background updates
6. Supports the same nested category structure
*/