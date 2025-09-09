import NavBar from '@/components/main-navbar/nav-bar'
import PetNavigationMenu from '@/components/pet-navigation-menu/pet-navigation-menu'

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <section>
        <NavBar />
        <PetNavigationMenu />
      </section>
      <section>{children}</section>
    </div>
  )
}
