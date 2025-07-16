import { Card, CardContent } from '@/components/ui/card'
import MagicLink from './magicLink'

export type RedirectPageProps = {
  searchParams: Promise<{
    em: string
    tk: string
    ui: string
  }>
}

export default async function RedirectPage(props: RedirectPageProps) {
  /* We grab the query params email and token */
  const { em, tk, ui } = await props.searchParams

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <Card className="w-full max-w-md p-4 h-[25vh]">
        <CardContent className="pt-6">
          <MagicLink email={em} token={tk} userInfo={ui} />
        </CardContent>
      </Card>
    </div>
  )
}
