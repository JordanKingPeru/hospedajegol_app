import { Button } from '@nextui-org/button'
import { SetStateAction, useMemo, useState, ChangeEvent } from 'react'
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
import {
  getFirestore,
  doc,
  onSnapshot,
  collection,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
  deleteField,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore'

type DateType = Date | string | null
interface DateRangeType {
  startDate: DateType
  endDate: DateType
}

export default function FormHsGolClient() {
  const [valueRegistros, setValueRegistros] = useState([])
  const [valueRegistrosRE, setValueRegistrosRE] = useState([])
  const [viewState, setViewState] = useState('main')
  const [editState, setEditState] = useState({})
  const [nav, setNav] = useState('Identificación')

  const nuevoRegistro = async () => {
    const db = getFirestore()
    const id = doc(collection(db, 'hospedaje'))
    const key = (id as any)._key.path.segments[1]
    const codigo = Math.random().toString(36).substring(2, 7).toUpperCase()
    const content = {
      key: key,
      id: codigo,
      docType: 'DNI',
      docId: '12345678',
      name: 'Juan',
      secondName: 'Perez',
      canalLlegada: 'Facebook',
      bookingNumber: '1234567890',
      tipoAlquiler: 'Momentaneo',
      habitacion: '201',
      precio: '100',
      cantidadDias: '1',
      fechaHospedaje: '28/09/2023'
    }
    try {
      setEditState(content)
      setViewState('edit')
      await setDoc(id, content)
    } catch (error) {
      console.log(error)
    }
  }
  const [valueDocType, setValueDocType] = useState<Set<string>>(new Set())
  const [valueDocId, setValueDocId] = useState('')
  const [valueName, setValueName] = useState('')
  const [valueSecondName, setValueSecondName] = useState('')
  const [valueCanalLlegada, setValueCanalLlegada] = useState<Set<string>>(
    new Set()
  )
  const [valueBookingNumber, setValueBookingNumber] = useState('')
  const [valueTipoAlquiler, setValueTipoAlquiler] = useState<Set<string>>(
    new Set()
  )
  const [valueHabitacion, setValueHabitacion] = useState<Set<string>>(new Set())
  const [valuePrecio, setValuePrecio] = useState('')
  const [valueCantidadDias, setValueCantidadDias] = useState('')
  const [valueDate, setValueDate] = useState<DateRangeType>({
    startDate: null,
    endDate: null
  })

  const handleSelectionChangeDocType = (e: ChangeEvent<HTMLSelectElement>) => {
    setValueDocType(new Set([e.target.value]))
  }

  const handleSelectionChangeCanal = (e: ChangeEvent<HTMLSelectElement>) => {
    setValueCanalLlegada(new Set([e.target.value]))
  }

  const handleSelectionTipoAlquiler = (e: ChangeEvent<HTMLSelectElement>) => {
    setValueTipoAlquiler(new Set([e.target.value]))
  }

  const handleSelectionHabitacion = (e: ChangeEvent<HTMLSelectElement>) => {
    setValueHabitacion(new Set([e.target.value]))
  }

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
  const validateBookingNumber = (value: string) => !!value.match(/^(?:\d{10})$/)
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

  const isBookingNumberInvalid = useMemo(() => {
    if (valueBookingNumber === '') return false
    return !validateBookingNumber(valueBookingNumber)
  }, [valueBookingNumber])

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
          Registro de cliente
        </h2>
        <p className='mt-1 text-sm leading-6 text-gray-600 dark:text-gray-100'>
          Registrar los datos del cliente y la habitación.
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
              className='w-full'
              selectedKeys={valueDocType}
              onChange={handleSelectionChangeDocType}
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
              selectedKeys={valueCanalLlegada}
              onChange={handleSelectionChangeCanal}
            >
              {canalContacto.map(canal => (
                <SelectItem key={canal.value} value={canal.value}>
                  {canal.label}
                </SelectItem>
              ))}
            </Select>
            <p className='text-small text-default-500'>
              Selected: {valueCanalLlegada}
            </p>
          </div>

          <div className='sm:col-span-3'>
            <InputElement
              label='Código reserva (Booking number)'
              type='text'
              key='bookingNumber'
              valueDocId={valueBookingNumber}
              setValueDocId={setValueBookingNumber}
              isInvalid={isBookingNumberInvalid}
              mesageError={'Son 10 digitos numéricos'}
            />
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
              selectedKeys={valueTipoAlquiler}
              onChange={handleSelectionTipoAlquiler}
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
              selectedKeys={valueHabitacion}
              onChange={handleSelectionHabitacion}
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
              label='Precio'
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
              setValueDocId={setValueCantidadDias}
              isInvalid={isCantidadDiasInvalid}
              mesageError={'Días enteros'}
              defaultValue={'1'}
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
        <Button
          onClick={nuevoRegistro}
          color='primary'
          size='sm'
          radius='sm'
          variant='solid'
        >
          Guardar
        </Button>
      </div>
    </form>
  )
}
