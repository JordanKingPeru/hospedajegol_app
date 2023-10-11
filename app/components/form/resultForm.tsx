import { Button, User } from '@nextui-org/react'
import { useViewContext } from '../../ViewContext'

type FormHsGolProps = {}

type Timestamp = {
  seconds: number
  nanoseconds: number
}

export default function FormHsGol({}: FormHsGolProps) {
  const { setViewState, content } = useViewContext()
  const Content = JSON.parse(content)

  function timestampToString(timestamp: Timestamp) {
    const months = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic'
    ]

    // Convertir el Timestamp de Firebase a milisegundos para usarlo con Date
    const date = new Date(timestamp.seconds * 1000)

    const day = date.getDate()
    const month = months[date.getMonth()] // getMonth() retorna un número entre 0 (Ene) y 11 (Dic)
    const year = date.getFullYear()

    return `${day} ${month} ${year}`
  }

  const features = [
    {
      name: 'Datos Cliente',
      caract01: (
        <User
          avatarProps={{ radius: 'full', size: 'sm', src: Content.avatar }}
          classNames={{
            description: 'text-default-500'
          }}
          description={Content.docType + ': ' + Content.docId}
          name={Content.name + ' ' + Content.secondName}
        >
          {Content.name + ' ' + Content.secondName}
        </User>
      ), //Content.name + ' ' + Content.secondName,
      caract02: 'R: ' + Content.rellenadoPor,
      caract03: Content.canalLlegada,
      caract04: 'Fecha: ' + timestampToString(Content.fechaHospedaje)
    },
    {
      name: 'Habitación',
      caract01: Content.tipoAlquiler + ' habitación: ' + Content.habitacion,
      caract02:
        '#días: ' +
        Content.cantidadDias +
        ', #personas: ' +
        Content.cantidadPersonas,
      caract03: 'Precio S/. ' + Content.precio,
      caract04: Content.medioDePago
    }
  ]

  return (
    <form>
      <div className=''>
        <div className='mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:grid-cols-2 lg:px-8'>
          <div>
            <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
              Registro completado
            </h2>
            <p className='mt-4'>
              Gracias por contribuir a mejorar los procesos del Hospedaje Gol.
            </p>

            <dl className='mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8'>
              {features.map(feature => (
                <div
                  key={feature.name}
                  className='border-t border-gray-200 pt-4'
                >
                  <dt className='font-extrabold '>{feature.name}</dt>
                  <dd className='mt-2 text-sm '>{feature.caract01}</dd>
                  <dd className='mt-2 text-sm '>{feature.caract02}</dd>
                  <dd className='mt-2 text-sm '>{feature.caract03}</dd>
                  <dd className='mt-2 text-sm '>{feature.caract04}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
      <div className='mt-6 flex items-center justify-end gap-x-6'>
        <Button
          color='primary'
          size='sm'
          radius='sm'
          variant='solid'
          onClick={() => {
            setViewState('reporte')
          }}
        >
          Confirmar
        </Button>
      </div>
    </form>
  )
}
