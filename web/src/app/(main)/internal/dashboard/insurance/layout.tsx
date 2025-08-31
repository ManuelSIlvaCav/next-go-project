export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" dark:bg-primary-foreground">
      <div className="w-[75vw] mx-auto flex flex-col  px-4 sm:px-6 lg:px-8 py-8">{children}</div>
    </div>
  )
}
