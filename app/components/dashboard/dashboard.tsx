import { Button } from '@nextui-org/button'

type DashboardHsGolProps = {
  onNewClient: () => void
  nuevoRegistro: () => void
}

export default function DashboardHsGol({
  onNewClient,
  nuevoRegistro
}: DashboardHsGolProps) {
  return (
    <section id='zonaDashboard' className='py-10'>
      <Button
        color='default'
        size='sm'
        radius='sm'
        variant='solid'
        onClick={() => {
          nuevoRegistro()
          onNewClient()
        }}
      >
        Nuevo cliente
      </Button>
    </section>
  )
}
