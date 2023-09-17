import { Button } from '@nextui-org/button'
import { useMemo, useState } from 'react'
import { Select, SelectSection, SelectItem } from '@nextui-org/select'
import InputElement from './elements/InputElement'
import {
  tipoDocumento,
  canalContacto,
  habitacionDisponible
} from './elements/dataOptions'
import { Divider } from '@nextui-org/divider'

export default function FormHsGolClient() {
  const [valueDocId, setValueDocId] = useState('')
  const [valueName, setValueName] = useState('')
  const [valueSecondName, setValueSecondName] = useState('')
  const validateDNI = (value: string) => !!value.match(/^(?:\d{8})$/)
  const validateName = (value: string) =>
    !!value.match(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/)

  const isDNIInvalid = useMemo(() => {
    if (valueDocId === '') return false
    return !validateDNI(valueDocId)
  }, [valueDocId])

  const isNameInvalid = useMemo(() => {
    if (valueName === '') return false
    return !validateName(valueName)
  }, [valueName])

  const isSecondNameInvalid = useMemo(() => {
    if (valueSecondName === '') return false
    return !validateName(valueSecondName)
  }, [valueSecondName])

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
            <Select
              isRequired
              size='md'
              radius='sm'
              labelPlacement='outside'
              variant='faded'
              label='Tipo documento'
              defaultSelectedKeys={['dni']}
              className='w-full'
            >
              {tipoDocumento.map(tipDoc => (
                <SelectItem key={tipDoc.value} value={tipDoc.value}>
                  {tipDoc.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className='sm:col-span-3'>
            <InputElement
              label='Número documento'
              type='text'
              key='docId'
              valueDocId={valueDocId}
              setValueDocId={setValueDocId}
              isInvalid={isDNIInvalid}
            />
          </div>
          <div className='sm:col-span-3'>
            <InputElement
              label='Nombre'
              type='text'
              key='nameClient'
              valueDocId={valueName}
              setValueDocId={setValueName}
              isInvalid={isNameInvalid}
            />
          </div>

          <div className='sm:col-span-3'>
            <InputElement
              label='Apellido'
              type='text'
              key='secondNameClient'
              valueDocId={valueSecondName}
              setValueDocId={setValueSecondName}
              isInvalid={isSecondNameInvalid}
            />
          </div>

          <div className='sm:col-span-3'>
            <Select
              isRequired
              size='md'
              radius='sm'
              labelPlacement='outside'
              variant='faded'
              label='¿Cómo conoció HS Gol?'
              className='w-full'
            >
              {canalContacto.map(canal => (
                <SelectItem key={canal.value} value={canal.value}>
                  {canal.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className='col-span-full'>
            <Divider className='my-4' />
          </div>

          <div className='sm:col-span-2 sm:col-start-1'>
            <Select
              isRequired
              size='md'
              radius='sm'
              labelPlacement='outside'
              variant='faded'
              label='Habitación'
              className='w-full'
            >
              {habitacionDisponible.map(habitacion => (
                <SelectItem key={habitacion.value} value={habitacion.value}>
                  {habitacion.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className='sm:col-span-2'>
            <InputElement
              label='Fecha de ingreso'
              type='number'
              key='fechaIngreso'
              valueDocId={valueName}
              setValueDocId={setValueName}
              isInvalid={isNameInvalid}
            />
          </div>

          <div className='sm:col-span-2'>
            <InputElement
              label='Costo'
              type='number'
              key='costoHospedaje'
              valueDocId={valueName}
              setValueDocId={setValueName}
              isInvalid={isNameInvalid}
            />
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
