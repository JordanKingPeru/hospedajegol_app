import { Button } from '@nextui-org/button'
import { Input } from '@nextui-org/input'
import { useMemo, useState } from 'react'

export default function FormHsGolClient() {
  const [value, setValue] = useState('')
  const [value_docid, setValue_docid] = useState('1234567')
  const validateEmail = (value: string) => value.match(/^(?:\d{8})$/)

  const isInvalid = useMemo(() => {
    if (value === '') return false

    return validateEmail(value) ? false : true
  }, [value])

  return (
    <form>
      <div className='border-b pb-12'>
        <h2 className='text-base font-semibold leading-7 text-gray-900 dark:text-gray-50'>
          Personal Information
        </h2>
        <p className='mt-1 text-sm leading-6 text-gray-600 dark:text-gray-100'>
          Use a permanent address where you can receive mail.
        </p>

        <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
          <div className='sm:col-span-3'>
            <Input
              type='email'
              key='first-name'
              isClearable
              labelPlacement='outside'
              radius='sm'
              variant='faded'
              label='Email'
              value={value_docid}
              description={value_docid}
              isInvalid={isInvalid}
              color={isInvalid ? 'danger' : 'success'}
              errorMessage={isInvalid && 'Please enter a valid email'}
              onClear={() => console.log('input cleared')}
              onValueChange={setValue_docid}
              classNames={{
                input: ['border-0', 'focus:outline-none', 'focus:ring-0']
              }}
            />
            <p className='text-small text-default-500'>
              Input value: {value_docid}
            </p>
          </div>

          <div className='sm:col-span-3'>
            <label
              htmlFor='last-name'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Last name
            </label>
            <div className='mt-2'>
              <input
                type='text'
                name='last-name'
                id='last-name'
                autoComplete='family-name'
                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              />
            </div>
          </div>

          <div className='sm:col-span-4'>
            <label
              htmlFor='email'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Email address
            </label>
            <div className='mt-2'>
              <input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              />
            </div>
          </div>

          <div className='sm:col-span-3'>
            <label
              htmlFor='country'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Country
            </label>
            <div className='mt-2'>
              <select
                id='country'
                name='country'
                autoComplete='country-name'
                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6'
              >
                <option>United States</option>
                <option>Canada</option>
                <option>Mexico</option>
              </select>
            </div>
          </div>

          <div className='col-span-full'>
            <label
              htmlFor='street-address'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              Street address
            </label>
            <div className='mt-2'>
              <input
                type='text'
                name='street-address'
                id='street-address'
                autoComplete='street-address'
                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              />
            </div>
          </div>

          <div className='sm:col-span-2 sm:col-start-1'>
            <label
              htmlFor='city'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              City
            </label>
            <div className='mt-2'>
              <input
                type='text'
                name='city'
                id='city'
                autoComplete='address-level2'
                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              />
            </div>
          </div>

          <div className='sm:col-span-2'>
            <label
              htmlFor='region'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              State / Province
            </label>
            <div className='mt-2'>
              <input
                type='text'
                name='region'
                id='region'
                autoComplete='address-level1'
                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              />
            </div>
          </div>

          <div className='sm:col-span-2'>
            <label
              htmlFor='postal-code'
              className='block text-sm font-medium leading-6 text-gray-900'
            >
              ZIP / Postal code
            </label>
            <div className='mt-2'>
              <input
                type='text'
                name='postal-code'
                id='postal-code'
                autoComplete='postal-code'
                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              />
            </div>
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
