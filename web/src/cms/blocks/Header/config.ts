import type { Block } from 'payload'

export const HeaderBlock: Block = {
  slug: 'header',
  interfaceName: 'HeaderBlock',
  admin: {},
  fields: [
    {
      name: 'position',
      type: 'select',
      defaultValue: 'middle',
      options: [
        {
          label: 'Left',
          value: 'left',
        },
        {
          label: 'Middle',
          value: 'middle',
        },
        {
          label: 'Right',
          value: 'right',
        },
      ],
    },
    {
      name: 'navigationItems',
      type: 'array',
      label: 'Navigation Items',
      access: {
        read: () => true,
        update: () => true,
      },
      required: true,
      minRows: 1,
      maxRows: 8,
      fields: [
        {
          name: 'isCategory',
          label: 'Es categoria',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'categories',
          admin: {
            condition: (_, siblingData) => siblingData?.isCategory,
          },
          type: 'relationship',
          hasMany: false,
          relationTo: 'categories',
        },
        {
          name: 'title',
          type: 'text',
          admin: {
            condition: (_, siblingData) => !siblingData?.isCategory,
          },
        },
      ],
    },
  ],
}
