import type { Collection, Endpoint, Where } from 'payload'

import { headersWithCors, mergeHeaders } from '@payloadcms/next/utilities'
import { APIError, generateCookie, getCookieExpiration } from 'payload'

// A custom endpoint that can be reached by POST request
// at: /api/users/external-users/login
export const externalUsersLogin: Endpoint = {
  method: 'post',
  path: '/external-users/login',
  handler: async (req) => {
    let data: { [key: string]: string } = {}

    try {
      if (typeof req.json === 'function') {
        data = await req.json()
      }
    } catch (error) {
      console.log('Error json data empty externalUsersLogin', { error })
    }

    const { password, businessId, email, isAdmin = false } = data

    console.log('External login', req)

    if (!email || !password) {
      throw new APIError('Email and Password are required for login.', 400, null, true)
    }

    let foundUser = null

    //If the external Login is an admin
    if (isAdmin) {
      foundUser = await req.payload.find({
        collection: 'users',
        where: buildQuery({
          isAdmin: Boolean(isAdmin),
          email,
        }),
      })
    } else {
      const fullTenant = (
        await req.payload.find({
          collection: 'tenants',
          where: {
            or: [
              {
                businessId: {
                  equals: businessId,
                },
              },
            ],
          },
        })
      ).docs[0]

      if (!fullTenant) {
        throw new APIError(`Tenant not found for email ${email}`, 400, null, true)
      }

      foundUser = await req.payload.find({
        collection: 'users',
        where: buildQuery({
          isAdmin: Boolean(isAdmin),
          email,
          tenantId: fullTenant?.id,
        }),
      })
    }

    console.log('foundUser', { foundUser })

    if (foundUser.totalDocs > 0) {
      try {
        const loginAttempt = await req.payload.login({
          collection: 'users',
          data: {
            email: foundUser.docs[0].email,
            password,
          },
          req,
        })

        console.log('loginAttempt', { loginAttempt, domain: req })

        if (loginAttempt?.token) {
          const collection: Collection = (req.payload.collections as { [key: string]: Collection })[
            'users'
          ]
          /* const cookie = generatePayloadCookie({
            collectionAuthConfig: collection.config.auth,
            cookiePrefix: req.payload.config.cookiePrefix,
            token: loginAttempt.token,
          }) */

          const cookie = generateCookie({
            name: `payload-token`,
            expires: getCookieExpiration({ seconds: collection.config.auth.tokenExpiration }),
            path: '/',
            returnCookieAsObject: false,
            value: loginAttempt.token,
          })

          const newHeaders = new Headers({
            'Set-Cookie': cookie as string,
          })

          // Ensure you merge existing response headers if they already exist
          req.responseHeaders = req.responseHeaders
            ? mergeHeaders(req.responseHeaders, newHeaders)
            : newHeaders

          return Response.json(loginAttempt, {
            headers: headersWithCors({
              headers: newHeaders,
              req,
            }),
            status: 200,
          })
        }

        throw new APIError(
          'Unable to login with the provided username and password.',
          400,
          null,
          true,
        )
      } catch (e) {
        console.log('Error externalUsersLogin', { e })
        throw new APIError(
          'Unable to login with the provided username and password.',
          400,
          null,
          true,
        )
      }
    }

    throw new APIError('Unable to login with the provided username and password.', 400, null, true)
  },
}

function buildQuery({
  isAdmin,
  email,
  tenantId,
}: {
  isAdmin: boolean
  email: string
  tenantId?: string | number
}): Where {
  if (isAdmin) {
    return {
      and: [
        {
          email: {
            equals: email,
          },
        },
        {
          roles: {
            contains: 'super-admin',
          },
        },
      ],
    }
  }
  return {
    and: [
      {
        email: {
          equals: email,
        },
      },
      {
        'tenants.tenant': {
          equals: tenantId,
        },
      },
    ],
  }
}
