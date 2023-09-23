import { Button } from '@nextui-org/button'
import HospedajeTable from './reporteClient'

type DashboardHsGolProps = {
  nuevoRegistro: () => void
}

export default function DashboardHsGol({ nuevoRegistro }: DashboardHsGolProps) {
  return (
    <section id='zonaDashboard' className='py-10'>
      <Button
        color='default'
        size='sm'
        radius='sm'
        variant='solid'
        onClick={() => {
          nuevoRegistro()
        }}
      >
        Nuevo cliente
      </Button>
      <div className='py-10'>
        <HospedajeTable />
      </div>
    </section>
  )
}
