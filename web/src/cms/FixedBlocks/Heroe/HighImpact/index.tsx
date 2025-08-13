'use client'
import React from 'react'

import { CMSLink } from '@/cms/components/Link'
import { Media } from '@/cms/components/Media'
import RichText from '@/cms/components/RichText'
import type { Page } from '@/payload-types'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  /* const { setTheme } = useTheme()

  useEffect(() => {
    setTheme('dark')
  }) */

  return (
    <div
      className="relative -mt-[10.4rem] flex items-center justify-center text-white"
      data-theme="dark"
    >
      <div className="container mb-8 z-10 relative flex items-center justify-center">
        <div className="max-w-146 md:text-center">
          {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex md:justify-center gap-4">
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <CMSLink {...link} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
      <div className="min-h-[80vh] select-none">
        {media && typeof media === 'object' && (
          <Media fill imgClassName="-z-10 object-cover" priority resource={media} />
        )}
      </div>
    </div>
  )
}
