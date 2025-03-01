import BusinessTabs from './Tabs'

export default async function BusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div className="flex flex-col space-y-4 items-center">
      <BusinessTabs id={id} />
    </div>
  )
}
