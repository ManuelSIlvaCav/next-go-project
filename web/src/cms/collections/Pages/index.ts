import type { CollectionConfig } from 'payload'

import { CallToAction } from '@/cms/blocks/CallToAction/config'
import { CarrouselBlock } from '@/cms/blocks/Carrousel/config'
import { Content } from '@/cms/blocks/Content/config'
import { tenantField } from '@/cms/fields/TenantField'
import { hero } from '@/cms/FixedBlocks/Heroe/config'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { getTenantAccessIDs } from '@/utilities/getTenantAccessIDs'
import { baseListFilter } from './access/baseListFilter'
import { canMutatePage } from './access/byTenant'
import { readAccess } from './access/readAccess'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    create: canMutatePage,
    delete: canMutatePage,
    read: readAccess,
    update: canMutatePage,
  },
  admin: {
    baseListFilter,
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug'],
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'pages',
          req,
        })

        return path
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'pages',
        req,
      }),
  },
  hooks: {
    beforeValidate: [
      ({ req, data }) => {
        console.log('beforeChange', { data, req, user: req?.user })
        if (req?.user?.tenants?.length && data) {
          const tenantIds = getTenantAccessIDs(req.user)
          data.tenant = tenantIds[0]
        }
        console.log('AFter', { data })
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'slug',
      type: 'text',
      defaultValue: 'home',
      hooks: {
        /* We insert the tenant field based on the user who is operating */
        //beforeValidate: [ensureUniqueSlug],
      },
      index: true,
    },
    tenantField,
    {
      type: 'tabs',
      tabs: [
        { fields: [hero], label: 'Hero' },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [CallToAction, Content, CarrouselBlock],
              required: true,
              admin: {
                //initCollapsed: true,
                disableListFilter: true,
              },
            },
          ],
          label: 'Content',
        },
      ],
    },
  ],
}
