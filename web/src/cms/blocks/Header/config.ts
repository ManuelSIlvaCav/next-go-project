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
  ],
}
