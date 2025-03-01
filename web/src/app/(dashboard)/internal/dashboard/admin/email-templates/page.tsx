import { withJwt } from '@/components/hoc/withJwt'
import { Skeleton } from '@/components/ui/skeleton'
import { Suspense } from 'react'
import AutomaticEmailsList from './List/list'

export default function AdminAutomaticEmails() {
  return (
    <div className="w-[75vw] flex flex-col pl-4">
      <Suspense
        fallback={
          <div>
            <Skeleton />
          </div>
        }
      >
        <AutomaticEmailsListWithAuth />
      </Suspense>
    </div>
  )
}

const AutomaticEmailsListWithAuth = withJwt(AutomaticEmailsList)
