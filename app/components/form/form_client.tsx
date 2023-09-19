import { Button } from '@nextui-org/button'
import { useMemo, useState, ChangeEvent } from 'react'
import { Select, SelectItem } from '@nextui-org/select'
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
  Timestamp,
  onSnapshot,
  collection,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
  deleteField,
  arrayUnion,
  arrayRemove,
  query,
  where
} from 'firebase/firestore'

type DateType = Date | string | null
interface DateRangeType {
  startDate: DateType
  endDate: DateType
}

type FormHsGolClientProps = {
  valueIdClient: string
  valueKeyClient: string
}

export default function FormHsGolClient({
  valueIdClient,
  valueKeyClient
}: FormHsGolClientProps) {
  const [valueRegistros, setValueRegistros] = useState([])
  const [valueRegistrosRE, setValueRegistrosRE] = useState([])
  const [viewState, setViewState] = useState('main')
  const [editState, setEditState] = useState({})
  const [nav, setNav] = useState('Identificación')

  type SelectType = { value: string; label: string }

  const [valueDocType, setValueDocType] = useState<SelectType | null>(null)
  const [valueDocId, setValueDocId] = useState('')
  const [valueName, setValueName] = useState('')
  const [valueSecondName, setValueSecondName] = useState('')
  const [valueCanalLlegada, setValueCanalLlegada] = useState<SelectType | null>(
    null
  )
  const [valueBookingNumber, setValueBookingNumber] = useState('')
  const [valueTipoAlquiler, setValueTipoAlquiler] = useState<SelectType | null>(
    null
  )
  const [valueHabitacion, setValueHabitacion] = useState<SelectType | null>(
    null
  )
  const [valuePrecio, setValuePrecio] = useState('')
  const [valueCantidadDias, setValueCantidadDias] = useState('')
  const [valueDate, setValueDate] = useState<DateRangeType>({
    startDate: null,
    endDate: null
  })

  const handleSelectionChangeDocType = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedDocType = tipoDocumento.find(
      item => item.value === e.target.value
    )

    if (selectedDocType) {
      setValueDocType(selectedDocType)
    }
  }

  const handleSelectionChangeCanal = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedCanalLlegada = canalContacto.find(
      item => item.value === e.target.value
    )

    if (selectedCanalLlegada) {
      setValueCanalLlegada(selectedCanalLlegada)
    }
  }

  const handleSelectionTipoAlquiler = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedTipoAlquiler = tiposAlquiler.find(
      item => item.value === e.target.value
    )

    if (selectedTipoAlquiler) {
      setValueTipoAlquiler(selectedTipoAlquiler)
    }
  }

  const handleSelectionHabitacion = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedHabitacion = habitacionDisponible.find(
      item => item.value === e.target.value
    )

    if (selectedHabitacion) {
      setValueHabitacion(selectedHabitacion)
    }
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

  // 1. Convert precio to a decimal number with one digit after the point.
  const formattedPrecio = parseFloat(parseFloat(valuePrecio).toFixed(1))

  // 2. Convert cantidadDias to an integer.
  const formattedCantidadDias = parseInt(valueCantidadDias, 10)

  // 3. Convert fechaHospedaje from 'DD/MM/YYYY' to a timestamp.
  const getFirebaseTimestamp = (date: DateType): Timestamp | null => {
    if (typeof date !== 'string') return null

    const [year, month, day] = date.split('-')
    // Ensure that day, month, and year are all available
    if (!day || !month || !year) return null

    // Create a new JavaScript Date object
    const jsDate = new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10)
    )

    // Check if the date is valid
    if (isNaN(jsDate.getTime())) return null

    return Timestamp.fromDate(jsDate)
  }

  const formattedFechaHospedaje = getFirebaseTimestamp(valueDate?.startDate)

  // 4. Convert name and secondName so that each word starts with an uppercase letter.
  const formatName = (str: string) => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const formattedName = formatName(valueName)
  const formattedSecondName = formatName(valueSecondName)

  const content = {
    key: valueKeyClient,
    id: valueIdClient,
    docType: valueDocType?.label,
    docId: valueDocId,
    name: formattedName,
    secondName: formattedSecondName,
    canalLlegada: valueCanalLlegada?.label,
    bookingNumber: valueBookingNumber,
    tipoAlquiler: valueTipoAlquiler?.label,
    habitacion: valueHabitacion?.label,
    precio: formattedPrecio,
    cantidadDias: formattedCantidadDias,
    fechaHospedaje: formattedFechaHospedaje
  }

  const guardar = async () => {
    const db = getFirestore()
    const id = doc(collection(db, 'hospedaje'), valueKeyClient)
    try {
      await updateDoc(id, content)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form>
      <div className='border-b pb-12'>
        <h2 className='text-base font-semibold leading-7 text-gray-900 dark:text-gray-50'>
          Registro de cliente: {valueIdClient}
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
              selectedKeys={valueDocType ? [valueDocType.value] : []}
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
              selectedKeys={valueCanalLlegada ? [valueCanalLlegada.value] : []}
              onChange={handleSelectionChangeCanal}
            >
              {canalContacto.map(canal => (
                <SelectItem key={canal.value} value={canal.value}>
                  {canal.label}
                </SelectItem>
              ))}
            </Select>
            <p className='text-small text-default-500'>
              Selected: {valueCanalLlegada?.label}
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
              selectedKeys={valueTipoAlquiler ? [valueTipoAlquiler.value] : []}
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
              selectedKeys={valueHabitacion ? [valueHabitacion.value] : []}
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
          color='primary'
          size='sm'
          radius='sm'
          variant='solid'
          onClick={() => guardar()}
        >
          Guardar
        </Button>
      </div>
    </form>
  )
}
