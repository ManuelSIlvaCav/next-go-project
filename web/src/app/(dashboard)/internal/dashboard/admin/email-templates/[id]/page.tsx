import { ApiParams } from '@/lib/types'
import { cookies } from 'next/headers'
import EmailEditorForm from '../../../emails/EmailEditorForm'
import { EmailTemplate } from '../List/columns'

async function getData(apiParams: ApiParams, id: string): Promise<EmailTemplate | null> {
  try {
    // Fetch data from your API here.
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/v1/email_templates/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiParams.jwt}`,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    const resp: { emailTemplate: EmailTemplate } = await response.json()

    return resp?.emailTemplate ?? null
  } catch (error) {
    console.error('Error fetching data', error)
    return null
  }
}

export default async function EmailTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const jwt = (await cookies()).get('jwt')
  const emailTemplate = await getData({ jwt: jwt?.value ?? '' }, id)
  console.log('emailTemplate', emailTemplate)
  return (
    <div>
      <EmailEditorForm emailTemplate={emailTemplate ?? null} />
    </div>
  )
}
