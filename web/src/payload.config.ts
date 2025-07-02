import { fileURLToPath } from 'node:url'
import path from 'path'
import { buildConfig } from 'payload'

import { mongooseAdapter } from '@payloadcms/db-mongodb' // database-adapter-import
import { sqliteAdapter } from '@payloadcms/db-sqlite'

import { Users } from '@/cms/collections/Users'
import sharp from 'sharp'
import { Media } from './cms/collections/Media'
import { Pages } from './cms/collections/Pages'
import { Tenants } from './cms/collections/Tenants'
import { defaultLexical } from './cms/fields/defaultLexical'

import { en } from '@payloadcms/translations/languages/en'
import { es } from '@payloadcms/translations/languages/es'
import { Categories } from './cms/collections/Categories'
import { plugins } from './cms/plugins'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      beforeLogin: ['@/cms/components/BeforeLogin#BeforeLogin'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1060,
          height: 800,
        },
      ],
    },
  },
  routes: {
    admin: '/cms/admin',
  },
  collections: [Users, Pages, Tenants, Media, Categories],
  i18n: {
    supportedLanguages: {
      en,
      es,
    },
  },

  db:
    process.env.ENV === 'prod' || process.env.ENV === 'dev'
      ? mongooseAdapter({
          url: process.env.MONGODB_URI || process.env.DATABASE_URI || '',
        })
      : sqliteAdapter({
          client: {
            url: process.env.DATABASE_URI || '',
          },
        }),
  editor: defaultLexical,
  sharp,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  plugins: [...plugins],
  cors: '*',
})
