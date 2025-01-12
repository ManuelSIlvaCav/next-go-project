import { sliderItems } from '@/cms/fields/SliderItems'
import type { Block } from 'payload'

export const CarrouselBlock: Block = {
  slug: 'carousel',
  interfaceName: 'CarrouselBlock',
  admin: {},
  fields: [sliderItems],
}
