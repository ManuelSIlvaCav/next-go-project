import { WithJwtProps } from '@/components/hoc/withJwt'
import { ApiParams } from '@/lib/types'
import { Business, columns } from './columns'
import { DataTable } from './data-table'
import NewUserDialog from './NewUserDialog'

async function getData(apiParams: ApiParams, id: string): Promise<Business[]> {
  try {
    // Fetch data from your API here.
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/v1/businesses/${id}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiParams.jwt}`,
      },
      cache: 'no-store',
      /* next: {
        tags: ['businesses-users']
      } */
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
    console.log('data', resp)

    return resp.data?.length ? resp.data : []
  } catch (error) {
    console.error('Error fetching data', error)
    return []
  }
}

export default async function BusinessUsersList(props: WithJwtProps & { id: string }) {
  const { jwt } = props

  const data = await getData({ jwt }, props.id)

  return (
    <div className="flex flex-col container mx-auto py-10 gap-4">
      <div className="flex flex-row justify-end">
        <NewUserDialog businessId={props.id} jwt={jwt} />
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
