import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SettingsForm from './settings-form'

export default function BusinessSettings(props: { businessId: string; jwt: string }) {
  return (
    <Card className="w-[10vw] justify-center  flex flex-col md:w-[25vw]">
      <CardHeader>
        <CardTitle>Actualizar negocio</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col px-6">
        <SettingsForm businessId={props.businessId} jwt={props.jwt} />
      </CardContent>
    </Card>
  )
}
