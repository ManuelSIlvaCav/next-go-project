import NavBar from '@/components/main-navbar/nav-bar'

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  const navbarHeight = '4rem'

  return (
    <div className="">
      <NavBar className={`h-[${navbarHeight}]`} />
      <div className={``}>{children}</div>
    </div>
  )
}
