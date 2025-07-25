import configPromise from '@payload-config'
import { draftMode, headers } from 'next/headers'
import { getPayload } from 'payload'

import { RenderBlocks } from '@/cms/blocks/RenderBlocks'
import { LivePreviewListener } from '@/cms/components/LivePreviewListener'
import type { Page as PageType } from '@/payload-types'
import { cache } from 'react'
import PageClient from './page.client'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug }
    })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const headersList = await headers()
  const domain = headersList.get('host') || ''

  //If no slug is found ex. google.com then slug is undefined we use reserved
  const { slug = 'reserved' } = await paramsPromise

  const url = '/' + slug

  const page: PageType | null = await queryPageBySlug({
    slug,
    domain,
  })

  // Remove this code once your website is seeded
  /* if (!page && slug === 'home') {
    page = homeStatic
  } */

  if (!page) {
    return <div>Page not found {url}</div>
    //return <PayloadRedirects url={url} />
  }

  const { layout } = page

  console.log('poage', { page, domain, draft })

  return (
    <article className="">
      <PageClient />
      Page Client
      {` ${slug}, ${url}, ${draft}`}
      {/* Allows redirects for valid pages too */}
      {/*  <PayloadRedirects disableNotFound url={url} /> */}
      {draft && <LivePreviewListener />}
      {/* <RenderHero {...hero} /> */}
      <RenderBlocks blocks={layout} />
    </article>
  )
}

/* export async function generateMetadata({ params: paramsPromise }): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  const page = await queryPageBySlug({
    slug,
  })

  return generateMeta({ doc: page })
} */

const queryPageBySlug = cache(async ({ slug, domain }: { slug: string; domain: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const tenantsQuery = await payload.find({
    collection: 'tenants',
    where: {
      or: [
        {
          'domains.domain': {
            contains: domain,
          },
        },
      ],
    },
  })

  console.log('tenantsQuery', { tenant: tenantsQuery.docs?.[0], slug, domain })

  if (!tenantsQuery.docs?.[0]) {
    return null
  }

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: true, //draft,
    where: {
      and: [
        {
          slug: {
            equals: slug,
          },
        },
      ],
    },
  })

  console.log('result', { result, slug, domain })

  return result.docs?.[0] || null
})
