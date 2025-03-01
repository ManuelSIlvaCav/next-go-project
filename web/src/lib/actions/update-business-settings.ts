'use server'

import { ApiParams } from '../types'

export async function updateBusinessSettings(
  apiParams: ApiParams,
  businessId: string,
  data: { subdomain: string },
) {
  try {
    // Fetch data from your API here.
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_PATH}/v1/businesses/${businessId}/settings`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiParams.jwt}`,
        },
        body: JSON.stringify({
          subdomain: data.subdomain,
        }),
      },
    )
    const jsonResponse = await response.json()

    if (!response.ok || response.status !== 201) {
      throw new Error(jsonResponse.message)
    }

    console.log('data', jsonResponse)

    await updateTenant({
      businessId,
      domains: [data.subdomain],
    })

    return jsonResponse.data
  } catch (error) {
    console.error('Error updateBusinessSettings', error)
    throw new Error('Error fetching data')
  }
}

async function updateTenant(data: { businessId: string; domains: string[] }) {
  try {
    const dataMap = {
      businessId: data.businessId,
      domains: data.domains,
    }

    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tenants/external-tenants/update`,
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

    console.log('Updating tenant', { jsonResponse })

    if (!resp.ok || resp.status !== 201) {
      throw new Error(jsonResponse.message)
    }

    return jsonResponse
  } catch (error) {
    console.log('Error updating tenant', { error })
  }
}
