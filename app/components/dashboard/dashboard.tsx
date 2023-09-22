import { Button } from '@nextui-org/button'

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
    </section>
  )
}
