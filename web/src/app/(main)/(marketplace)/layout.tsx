import NavBar from '@/components/main-navbar/nav-bar'

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <NavBar />
      <div className="pt-20">{children}</div>
    </div>
  )
}
