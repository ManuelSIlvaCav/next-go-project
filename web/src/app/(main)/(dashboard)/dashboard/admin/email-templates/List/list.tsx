import { WithJwtProps } from '@/components/hoc/withJwt'
import { Button } from '@/components/ui/button'
import { ApiParams } from '@/lib/types'
import Link from 'next/link'
import { EmailGeneralTemplate, columns } from './columns'
import { DataTable } from './data-table'

async function getData(apiParams: ApiParams): Promise<EmailGeneralTemplate[]> {
  try {
    // Fetch data from your API here.
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/v1/email_templates`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiParams.jwt}`,
      },
      cache: 'no-store',
    })
    if (!response.ok) {
      return []
    }
    const resp: { emailTemplates: EmailGeneralTemplate[] } = await response.json()

    /* {id: '9',
      name: 'A cute little name2',
      subject: 'Test Subject',
      body: 'body',
      meta_data: [Object],
      created_at: '2024-12-01T15:16:45.802732Z',
      updated_at: '2024-12-01T15:16:45.802732Z'} */
    console.log('data', resp)

    return resp?.emailTemplates?.length ? resp.emailTemplates : []
  } catch (error) {
    console.error('Error fetching data', error)
    return []
  }
}

export default async function AutomaticEmailsList(props: WithJwtProps) {
  const jwt = props.jwt
  const data = await getData({ jwt })

  return (
    <div className="flex flex-col container mx-auto py-10 gap-4">
      <div className="flex flex-row justify-end">
        <Button className="" variant={'default'} type="button" asChild>
          <Link href="/internal/dashboard/admin/email-templates/create">Crear Nuevo Email</Link>
        </Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
