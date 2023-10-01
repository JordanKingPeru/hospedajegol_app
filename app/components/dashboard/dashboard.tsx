import { Button } from '@nextui-org/button'
import HospedajeTable from './reporteClient'

type DashboardHsGolProps = {
  nuevoRegistro: () => void
}

export default function DashboardHsGol({ nuevoRegistro }: DashboardHsGolProps) {
  return (
    <section id='zonaDashboard' className='py-6'>
      <HospedajeTable nuevoRegistro={nuevoRegistro} />
    </section>
  )
}
