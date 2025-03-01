'use server'

import { ApiParams } from '../types'

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

  console.log('Business created', { jsonResponse })
  /* Example of response */

  //Try to create on CMS database
  await createTenant({
    businessId: jsonResponse.data.id,
    name: jsonResponse.data.name,
  })

  return jsonResponse
}

async function createTenant(data: { businessId: string; name: string }) {
  try {
    const dataMap = {
      name: data.name,
      businessId: data.businessId,
    }

    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tenants/external-tenants/create`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataMap),
      },
    )

    const jsonResponse = await resp.json()

    console.log('Creating tenant', { jsonResponse })

    if (!resp.ok || resp.status !== 201) {
      throw new Error(jsonResponse.message)
    }

    return jsonResponse
  } catch (error) {
    console.log('Error creating tenant', { error })
  }
}
