import type { Endpoint } from 'payload'

// A custom endpoint that can be reached by POST request
// at: /api/users/external-users/login
export const externalCreateTenant: Endpoint = {
  method: 'post',
  path: '/external-tenants/create',
  handler: async (req) => {
    let data: { [key: string]: string | Array<string> } = {}

    try {
      if (typeof req.json === 'function') {
        data = await req.json()
      }
    } catch (error) {
      console.log('Error json data empty externalUsersLogin', { error })
    }

    const { businessId, name } = data

    const response = await req.payload.create({
      collection: 'tenants',
      data: {
        name: name as string,
        businessId: businessId as string,
      },
    })

    return Response.json(response, {
      status: 201,
    })
  },
}
