import { Button } from '@nextui-org/button'
import { SetStateAction, useMemo, useState } from 'react'
import { Select, SelectSection, SelectItem } from '@nextui-org/select'
import InputElement from './elements/InputElement'
import {
  tipoDocumento,
  canalContacto,
  habitacionDisponible,
  tiposAlquiler
} from './elements/dataOptions'
import { Divider } from '@nextui-org/divider'
import Datepicker from 'react-tailwindcss-datepicker'

type DateType = Date | string | null
interface DateRangeType {
  startDate: DateType
  endDate: DateType
}

export default function FormHsGolClient() {
  const [valueDocId, setValueDocId] = useState('')
  const [valueName, setValueName] = useState('')
  const [valueSecondName, setValueSecondName] = useState('')
  const [valuePrecio, setValuePrecio] = useState('')
  const [valueCantidadDias, setValuePCantidadDias] = useState('')
  const [valueDate, setValueDate] = useState<DateRangeType>({
    startDate: null,
    endDate: null
  })

  const handleValueChange = (
    newValue: DateRangeType | null,
    e?: HTMLInputElement | null
  ) => {
    if (newValue) {
      console.log('newValue:', newValue)
      setValueDate(newValue)
    }
  }

  const validateDNI = (value: string) => !!value.match(/^(?:\d{8})$/)
  const validateName = (value: string) =>
    !!value.match(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/)

  // Validation function for the price
  const validatePrecio = (value: string) =>
    !!value.match(/^(0|[1-9]\d*)(\.\d)?$/)

  // Validation function for the quantity of days
  const validateCantidadDias = (value: string) => !!value.match(/^[1-9]\d*$/)

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

  // useMemo hook to determine if the price is invalid
  const isPrecioInvalid = useMemo(() => {
    if (valuePrecio === '') return false
    return !validatePrecio(valuePrecio)
  }, [valuePrecio])

  // useMemo hook to determine if the quantity of days is invalid
  const isCantidadDiasInvalid = useMemo(() => {
    if (valueCantidadDias === '') return false
    return !validateCantidadDias(valueCantidadDias)
  }, [valueCantidadDias])

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
              mesageError={'DNI con 8 digitos numéricos'}
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
              mesageError={'Sólo 1 espacio'}
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
              mesageError={'Sólo 1 espacio'}
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
              label='Tipo alquiler'
              className='w-full'
            >
              {tiposAlquiler.map(tipoAlquiler => (
                <SelectItem key={tipoAlquiler.value} value={tipoAlquiler.value}>
                  {tipoAlquiler.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className='sm:col-span-2'>
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
              label='Costo'
              type='number'
              key='costoHospedaje'
              valueDocId={valuePrecio}
              setValueDocId={setValuePrecio}
              isInvalid={isPrecioInvalid}
              isEndContent={true}
              mesageError={'Precio con 1 decimal'}
            />
          </div>

          <div className='sm:col-span-2'>
            <InputElement
              label='Cantidad de días'
              type='number'
              key='cantidadDias'
              valueDocId={valueCantidadDias}
              setValueDocId={setValuePCantidadDias}
              isInvalid={isCantidadDiasInvalid}
              mesageError={'Días enteros'}
            />
          </div>

          <div className='sm:col-span-4'>
            <Datepicker
              i18n={'es-mx'}
              startWeekOn='mon'
              primaryColor={'rose'}
              useRange={false}
              separator={'a'}
              placeholder={'Fecha hospedaje'}
              value={valueDate}
              onChange={handleValueChange}
              displayFormat={'DD-MM-YYYY'}
              asSingle={true}
              showFooter={false}
              showShortcuts={true}
              popoverDirection='down'
              inputClassName='w-full rounded-md focus:ring-0 text-sm text-gray-600 bg-gray-50 border-gray-300 dark:bg-gray-800 dark:border-gray-70 dark:text-gray-100'
              containerClassName='relative'
              configs={{
                shortcuts: {
                  today: 'Hoy'
                },
                footer: {
                  cancel: 'Cancelar',
                  apply: 'Aceptar'
                }
              }}
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
