import { withJwt } from '@/components/hoc/withJwt'
import CreateBusinessForm, { CreateBusinessFormProps } from './form'

export default async function CreatePage() {
  return (
    <div>
      <h2>Crear Nuevo Negocio</h2>
      <div className="flex flex-col justify-center items-center pt-4">
        <BusinessFormComponent />
      </div>
    </div>
  )
}

const BusinessFormComponent = withJwt<Omit<CreateBusinessFormProps, 'jwt'>>(CreateBusinessForm)
