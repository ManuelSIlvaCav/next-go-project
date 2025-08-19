import NavBar from '@/components/main-navbar/nav-bar'

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <section>
        <NavBar />
      </section>
      <section>{children}</section>
    </div>
  )
}
