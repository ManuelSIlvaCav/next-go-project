import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'
import { CallToActionBlock } from './CallToAction/Component'
import { CarrouselBlock } from './Carrousel/Component'
import { ContentBlock } from './Content/Component'

const blockComponents = {
  cta: CallToActionBlock,
  content: ContentBlock,
  carousel: CarrouselBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="" key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer={true} />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
