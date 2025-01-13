'use server'

import { ApiParams } from '@/app/(dashboard)/internal/dashboard/admin/businesses/[id]/Users/list'

export default async function createBusinessRequest(data: {
  apiParams: ApiParams
  name: string
  legal_name: string
  identifier: string
}) {
  const resp = await fetch(`${process.env.NEXT_PUBLIC_API_PATH}/v1/businesses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${data?.apiParams.jwt}`,
    },
    body: JSON.stringify(data),
  })

  const jsonResponse = await resp.json()

  if (!resp.ok || resp.status !== 201) {
    throw new Error(jsonResponse.message)
  }

  return jsonResponse
}
