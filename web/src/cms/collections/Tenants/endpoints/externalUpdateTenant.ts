import type { Endpoint } from 'payload'

// A custom endpoint that can be reached by POST request
// at: /api/users/external-users/login
export const externalUpdateTenant: Endpoint = {
  method: 'post',
  path: '/external-tenants/update',
  handler: async (req) => {
    let data: { [key: string]: string | Array<string> } = {}

    try {
      if (typeof req.json === 'function') {
        data = await req.json()
      }
    } catch (error) {
      console.log('Error json data empty externalUsersLogin', { error })
    }

    const { businessId, domains = [] } = data

    console.log('data', data)

    const response = await req.payload.update({
      collection: 'tenants',
      where: {
        businessId: {
          equals: businessId as string,
        },
      },
      data: {
        domains: (domains as Array<string>).map((domain, index) => ({
          domain,
          id: String(index),
        })),
      },
    })

    return Response.json(response, {
      status: 201,
    })
  },
}
