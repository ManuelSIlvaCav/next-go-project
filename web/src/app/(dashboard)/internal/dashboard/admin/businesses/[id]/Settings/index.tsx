import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SettingsForm from './settings-form'

export default async function BusinessSettings(props: { businessId: string }) {
  return (
    <Card className="w-[30vw] justify-center  flex flex-col md:w-[40vw]">
      <CardHeader>
        <CardTitle>Actualizar negocio</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col px-6">
        <SettingsForm businessId={props.businessId} />
      </CardContent>
    </Card>
  )
}
