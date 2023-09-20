import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { Image } from '@nextui-org/react'

export default function FormHsGol() {
  const features = [
    { name: 'Datos Cliente', description: 'Designed by Good Goods, Inc.' },
    {
      name: 'Habitación',
      description:
        'Solid walnut base with rare earth magnets and powder coated steel card cover'
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
                  <dt className='font-medium '>{feature.name}</dt>
                  <dd className='mt-2 text-sm '>{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className='grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8'>
            <Image
              src='https://tailwindui.com/img/ecommerce-images/product-feature-03-detail-01.jpg'
              alt='Walnut card tray with white powder coated steel divider and 3 punchout holes.'
              className='rounded-lg bg-gray-100'
            />
            <Image
              src='https://tailwindui.com/img/ecommerce-images/product-feature-03-detail-02.jpg'
              alt='Top down view of walnut card tray with embedded magnets and card groove.'
              className='rounded-lg bg-gray-100'
            />
          </div>
        </div>
      </div>
    </form>
  )
}
