import AmazonNavbar from '@/app/(main)/(marketplace)/NavBar'

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <section>
        <AmazonNavbar />
      </section>
      <section>{children}</section>
    </div>
  )
}
