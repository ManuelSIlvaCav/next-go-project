import MainCategories from './MainCategories'

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <section>
        <div className="bg-gradient-to-r from-primary to-blue-600 pt-6 dark:from-purple-900 dark:to-blue-900">
          <div className="container mx-auto px-4">
            {/* Categories Navigation */}
            <MainCategories />
          </div>
        </div>
      </section>
      {children}
    </div>
  )
}
