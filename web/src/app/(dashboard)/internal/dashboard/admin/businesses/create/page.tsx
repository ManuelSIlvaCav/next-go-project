import { cookies } from 'next/headers'
import CreateBusinessForm from './form'

export default async function CreatePage() {
  const cookieStore = await cookies()
  console.log('cookieStore', cookieStore)
  const jwt = cookieStore.get('jwt')?.value

  return (
    <div>
      <h1>Create Business</h1>

      <div className="flex flex-col justify-center items-center">
        <CreateBusinessForm params={{ jwt }} />
      </div>
    </div>
  )
}
