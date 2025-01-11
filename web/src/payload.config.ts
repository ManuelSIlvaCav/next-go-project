import { fileURLToPath } from 'node:url'
import path from 'path'
import { buildConfig } from 'payload'

import { sqliteAdapter } from '@payloadcms/db-sqlite'

import { Users } from '@/cms/collections/Users'
import { Media } from './cms/collections/Media'
import { Pages } from './cms/collections/Pages'
import { Tenants } from './cms/collections/Tenants'
import { defaultLexical } from './cms/fields/defaultLexical'

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
  },
  routes: {
    admin: '/cms/admin',
  },
  collections: [Users, Pages, Tenants, Media],
  cors: ['http://localhost', process.env.NEXT_PUBLIC_SERVER_URL || ''].filter(Boolean),
  csrf: ['http://localhost', process.env.NEXT_PUBLIC_SERVER_URL || ''].filter(Boolean),
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || '',
    },
  }),
  editor: defaultLexical,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
