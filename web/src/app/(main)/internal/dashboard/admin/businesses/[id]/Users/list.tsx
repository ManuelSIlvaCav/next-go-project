import { Skeleton } from '@/components/ui/skeleton'
import { ApiParams } from '@/lib/types'
import { cookies } from 'next/headers'
import { Suspense } from 'react'
import { Business, columns } from './columns'
import { DataTable } from './data-table'
import NewUserDialog from './NewUserDialog'

async function getData(apiParams: ApiParams, id: string): Promise<Business[]> {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate a delay
    // Fetch data from your API here.
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/v1/businesses/${id}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiParams.jwt}`,
      },
    })
    const resp = await response.json()

    /* {
      id: '1',
      business_id: '1',
      first_name: 'Manuel',
      last_name: 'Silva',
      email: 'manuel@gmail.com',
      phone: '1111111'
    } */
    return resp.data?.length ? resp.data : []
  } catch (error) {
    console.error('Error fetching data', error)
    return []
  }
}

export default async function BusinessUsersList(props: { id: string }) {
  return (
    <div className="flex flex-col container mx-auto py-10 gap-4">
      <div className="flex flex-row justify-end">
        <NewUserDialog businessId={props.id} />
      </div>
      <Suspense fallback={<Skeleton className="h-[20vh]" />}>
        <TableData id={props.id} />
      </Suspense>
    </div>
  )
}

async function TableData(props: { id: string }) {
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value ?? ''
  const data = await getData({ jwt }, props.id)
  return <DataTable columns={columns} data={data} />
}
