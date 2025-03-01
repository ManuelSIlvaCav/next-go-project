import type { CollectionConfig } from 'payload'

import { isSuperAdmin } from '@/cms/access/isSuperAdmin'
import { canMutateTenant } from './access/byTenant'
import { externalCreateTenant } from './endpoints/externalCreateTenant'
import { externalUpdateTenant } from './endpoints/externalUpdateTenant'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  access: {
    create: isSuperAdmin,
    delete: canMutateTenant,
    read: () => true, //filterByTenantRead,
    update: canMutateTenant,
  },
  admin: {
    useAsTitle: 'name',
    hidden: ({ user }) => {
      if (user?.roles?.includes?.('super-admin')) {
        return false
      }
      return true
    },
  },
  endpoints: [externalCreateTenant, externalUpdateTenant],
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'businessId',
      type: 'text',
      required: true,
      unique: true,
    },
    // The domains field allows you to associate one or more domains with a tenant.
    // This is used to determine which tenant is associated with a specific domain,
    // for example, 'abc.localhost.com' would match to 'Tenant 1'.

    // Uncomment this field if you want to enable domain-based tenant handling.
    {
      name: 'domains',
      type: 'array',
      fields: [
        {
          name: 'domain',
          type: 'text',
          required: true,
        },
      ],
      index: true,
    },
    /* {
      name: 'slug',
      type: 'text',
      admin: {
        description: 'Used for url paths, example: /tenant-slug/page-slug',
      },
      index: true,
      required: true,
    }, */
    /* {
      name: 'public',
      type: 'checkbox',
      admin: {
        description: 'If checked, logging in is not required.',
        position: 'sidebar',
      },
      defaultValue: false,
      index: true,
    }, */
  ],
}
