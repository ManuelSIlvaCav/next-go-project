import { Button } from '@/components/ui/button'
import { ApiParams } from '@/lib/types'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Business, columns } from './columns'
import { DataTable } from './data-table'

async function getData(apiParams: ApiParams): Promise<Business[]> {
  try {
    // Fetch data from your API here.
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/v1/businesses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiParams.jwt}`,
      },
      cache: 'no-store',
    })
    const resp = await response.json()

    /* {id: '9',
      name: 'A cute little name2',
      subject: 'Test Subject',
      body: 'body',
      meta_data: [Object],
      created_at: '2024-12-01T15:16:45.802732Z',
      updated_at: '2024-12-01T15:16:45.802732Z'} */

    return resp.data?.length ? resp.data : []
  } catch (error) {
    console.error('Error fetching data', error)
    return []
  }
}

export default async function BusinessesList() {
  const cookieStore = await cookies()
  const data = await getData({ jwt: cookieStore.get('jwt')?.value ?? '' })

  return (
    <div className="flex flex-col container mx-auto py-10 gap-4">
      <div className="flex flex-row justify-end">
        <Button className="" variant={'default'} type="button" asChild>
          <Link href="/internal/dashboard/admin/businesses/create">Crear Nueva Empresa</Link>
        </Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
