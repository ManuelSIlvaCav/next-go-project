import type { Field } from 'payload'

export const sliderItems: Field = {
  name: 'sliderItems',
  type: 'array',
  label: 'Slider Items',
  access: {
    read: () => true,
    update: () => true,
  },
  admin: {
    disableListColumn: true,
  },
  hooks: {
    beforeValidate: [],
  },
  required: true,
  minRows: 1,
  maxRows: 8,
  fields: [
    {
      name: 'landscapeImg',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Image should be 1920x1080',
      },
    },
    {
      name: 'portraitImg',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Image should be 1080x1920',
      },
    },
  ],
}
