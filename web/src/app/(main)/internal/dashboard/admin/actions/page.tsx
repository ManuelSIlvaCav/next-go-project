import { withJwt } from '@/components/hoc/withJwt'
import { Skeleton } from '@/components/ui/skeleton'
import { Suspense } from 'react'
import ActionList from './List/list'

export default function AdminActions() {
  return (
    <div className="w-[75vw] flex flex-col pl-4">
      <Suspense
        fallback={
          <div>
            <Skeleton />
          </div>
        }
      >
        <ActionsListWithAuth />
      </Suspense>
    </div>
  )
}

const ActionsListWithAuth = withJwt(ActionList)
