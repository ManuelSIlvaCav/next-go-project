import RichText from '@/cms/components/RichText'
import { cn } from '@/lib/utils'
import { CMSLink } from '../../components/Link'

import type { ContentBlock as ContentBlockProps } from '@/payload-types'

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { columns } = props

  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
  }

  return (
    <div className="container my-16">
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-16">
        {columns?.map((col, index) => {
          const { enableLink, link, richText, size } = col

          return (
            <div
              className={cn(`col-span-4 lg:col-span-${colsSpanClasses[size!]}`, {
                'md:col-span-2': size !== 'full',
              })}
              key={index}
            >
              {richText && <RichText data={richText} enableGutter={false} />}

              {enableLink && <CMSLink {...link} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
