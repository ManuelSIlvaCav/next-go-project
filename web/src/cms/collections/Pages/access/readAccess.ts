import type { Access, Where } from 'payload'

import { parseCookies } from 'payload'

import { getTenantAccessIDs } from '@/utilities/getTenantAccessIDs'
import { isSuperAdmin } from '../../../access/isSuperAdmin'

export const readAccess: Access = (args) => {
  const req = args.req
  const cookies = parseCookies(req.headers)
  const superAdmin = isSuperAdmin(args)
  const selectedTenant = cookies.get('payload-tenant')
  const tenantAccessIDs = getTenantAccessIDs(req.user)

  const publicPageConstraint: Where = {
    'tenant.public': {
      equals: true,
    },
  }

  console.log('access', {
    superAdmin,
    selectedTenant,
    tenantAccessIDs,
  })

  // If no manually selected tenant,
  // but it is a super admin, give access to all
  if (superAdmin) {
    return true
  }

  // If it's a super admin or has access to the selected tenant
  if (
    selectedTenant &&
    (superAdmin || tenantAccessIDs.some((id) => id.toString() === selectedTenant))
  ) {
    // filter access by selected tenant
    return {
      or: [
        publicPageConstraint,
        {
          in: {
            in: tenantAccessIDs,
          },
        },
      ],
    }
  }

  // If not super admin,
  // but has access to tenants,
  // give access to only their own tenants
  if (tenantAccessIDs.length) {
    return {
      or: [
        publicPageConstraint,
        {
          tenant: {
            in: tenantAccessIDs,
          },
        },
      ],
    }
  }

  // Allow access to public pages
  return publicPageConstraint
}
