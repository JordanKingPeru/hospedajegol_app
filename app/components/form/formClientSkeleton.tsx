import { Button } from '@nextui-org/button'
import { Skeleton } from '@nextui-org/skeleton'
import { Divider } from '@nextui-org/divider'

export default function FormHsGolClientSkeleton() {
  return (
    <form>
      <div className='border-b pb-10'>
        <div className='mt-5 grid grid-cols-1 gap-x-6 gap-y-8 pt-5 sm:grid-cols-9'>
          <div className='sm:col-span-8'>
            <h2 className='font-semibold text-gray-900 dark:text-gray-50'>
              Registro de cliente:
            </h2>
            <p className='leading-1 mt-1 pb-5 text-sm text-gray-600 dark:text-gray-100'>
              Registrar los datos del cliente y la habitación.
            </p>
          </div>
          <div className='sm:col-span-3'>
            <Skeleton className='rounded-lg'>
              <div className='h-10 rounded-lg bg-default-300'></div>
            </Skeleton>
          </div>
          <div className='sm:col-span-3'>
            <Skeleton className='rounded-lg'>
              <div className='h-10 rounded-lg bg-default-300'></div>
            </Skeleton>
          </div>
          <div className='sm:col-span-3'>
            <Skeleton className='rounded-lg'>
              <div className='h-10 rounded-lg bg-default-300'></div>
            </Skeleton>
          </div>
          <div className='sm:col-span-4'>
            <Skeleton className='rounded-lg'>
              <div className='h-10 rounded-lg bg-default-300'></div>
            </Skeleton>
          </div>

          <div className='sm:col-span-5'>
            <Skeleton className='rounded-lg'>
              <div className='h-10 rounded-lg bg-default-300'></div>
            </Skeleton>
          </div>

          <div className='sm:col-span-4'>
            <Skeleton className='rounded-lg'>
              <div className='h-10 rounded-lg bg-default-300'></div>
            </Skeleton>
          </div>

          <div className='sm:col-span-5'>
            <Skeleton className='rounded-lg'>
              <div className='h-10 rounded-lg bg-default-300'></div>
            </Skeleton>
          </div>

          <div className='col-span-full'>
            <Divider className='my-2' />
          </div>

          <div className='sm:col-span-3 sm:col-start-1'>
            <Skeleton className='rounded-lg'>
              <div className='h-10 rounded-lg bg-default-300'></div>
            </Skeleton>
          </div>

          <div className='sm:col-span-2'>
            <Skeleton className='rounded-lg'>
              <div className='h-10 rounded-lg bg-default-300'></div>
            </Skeleton>
          </div>

          <div className='sm:col-span-2'>
            <Skeleton className='rounded-lg'>
              <div className='h-10 rounded-lg bg-default-300'></div>
            </Skeleton>
          </div>

          <div className='sm:col-span-2'>
            <Skeleton className='rounded-lg'>
              <div className='h-10 rounded-lg bg-default-300'></div>
            </Skeleton>
          </div>

          <div className='col-span-full'>
            <Divider className='my-2' />
          </div>

          <div className='sm:col-span-3'>
            <Skeleton className='rounded-lg'>
              <div className='h-10 rounded-lg bg-default-300'></div>
            </Skeleton>
          </div>

          <div className='sm:col-span-2'>
            <Skeleton className='rounded-lg'>
              <div className='h-10 rounded-lg bg-default-300'></div>
            </Skeleton>
          </div>

          <div className='sm:col-span-4'>
            <Skeleton className='rounded-lg'>
              <div className='h-10 rounded-lg bg-default-300'></div>
            </Skeleton>
          </div>
        </div>
      </div>

      <div className='mt-6 flex items-center justify-end gap-x-6'>
        <Button color='default' size='sm' radius='sm' variant='flat'>
          Cancelar
        </Button>
        <Button color='primary' size='sm' radius='sm' variant='solid'>
          Guardar
        </Button>
      </div>
    </form>
  )
}
