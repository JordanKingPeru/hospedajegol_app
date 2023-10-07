import { Button } from '@nextui-org/button'
import { useMemo, useState, ChangeEvent } from 'react'
import { Select, SelectItem } from '@nextui-org/select'
import InputElement from './elements/InputElement'
import {
  handleSelectionChange,
  validateDNI,
  validateBookingNumber,
  validateName,
  validatePrecio,
  validateCantidadDias,
  formatName
} from './elements/utils'
import {
  tipoDocumento,
  canalContacto,
  habitacionDisponible,
  tiposAlquiler,
  rellenadoPor,
  medioPago
} from './elements/dataOptions'
import { Divider } from '@nextui-org/divider'
import Datepicker from 'react-tailwindcss-datepicker'
import {
  getFirestore,
  doc,
  Timestamp,
  collection,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore'
import { Switch, cn } from '@nextui-org/react'

type DateType = Date | string | null
interface DateRangeType {
  startDate: DateType
  endDate: DateType
}

type FormHsGolClientProps = {
  valueIdClient: string
  valueKeyClient: string
  valueContent: string
  handleDetalle: () => void
  handleReporte: () => void
  handleContentChange: (value: string) => void
}

const deleteRecord = async (id: string) => {
  try {
    await db.collection('your_collection_name').doc(id).delete()
    // Reemplaza 'your_collection_name' con el nombre de tu colección en Firebase
    console.log('Document successfully deleted!')
    // Aquí puedes agregar código para actualizar tu UI si es necesario
  } catch (error) {
    console.error('Error removing document: ', error)
  }
}

export default function FormHsGolClient({
  valueIdClient,
  valueKeyClient,
  valueContent,
  handleDetalle,
  handleReporte,
  handleContentChange
}: FormHsGolClientProps) {
  const Content = JSON.parse(valueContent)

  type SelectType = { value: string; label: string }

  const [isDatosClientes, setIsDatosClientes] = useState(false)
  const [valueRellenadoPor, setValueRellenadoPor] = useState<SelectType>(
    Content.rellenadoPor
  )
  const [valueDocType, setValueDocType] = useState<SelectType>(Content.docType)
  const [valueDocId, setValueDocId] = useState('') //Content.docId
  const [valueName, setValueName] = useState(Content.name)
  const [valueSecondName, setValueSecondName] = useState(Content.secondName)
  const [valueCanalLlegada, setValueCanalLlegada] = useState<SelectType>(
    Content.canalLlegada
  )
  const [valueBookingNumber, setValueBookingNumber] = useState(
    Content.bookingNumber
  )
  const [valueTipoAlquiler, setValueTipoAlquiler] = useState<SelectType>(
    Content.tipoAlquiler
  )
  const [valueHabitacion, setValueHabitacion] = useState<SelectType>(
    Content.habitacion
  )
  const [valueMedioPago, setValueMedioPago] = useState<SelectType>(
    Content.medioDePago
  )
  const [valuePrecio, setValuePrecio] = useState(Content.precio)
  const [valueCantidadPersonas, setValueCantidadPersonas] = useState(
    Content.cantidadPersonas.toString()
  )
  const [valueCantidadDias, setValueCantidadDias] = useState(
    Content.cantidadDias.toString()
  )
  const [valueDate, setValueDate] = useState<DateRangeType>({
    startDate: null,
    endDate: null
  })

  const handleSelectionChangeRellenadoPor = handleSelectionChange(
    rellenadoPor,
    setValueRellenadoPor
  )

  const handleSelectionChangeDocType = handleSelectionChange(
    tipoDocumento,
    setValueDocType
  )

  const handleSelectionChangeCanal = handleSelectionChange(
    canalContacto,
    setValueCanalLlegada
  )

  const handleSelectionTipoAlquiler = handleSelectionChange(
    tiposAlquiler,
    setValueTipoAlquiler
  )

  const handleSelectionHabitacion = handleSelectionChange(
    habitacionDisponible,
    setValueHabitacion
  )

  const handleSelectionMedioPago = handleSelectionChange(
    medioPago,
    setValueMedioPago
  )

  const handleValueChange = (
    newValue: DateRangeType | null,
    e?: HTMLInputElement | null
  ) => {
    if (newValue) {
      setValueDate(newValue)
    }
  }

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

  const formattedName = formatName(valueName)
  const formattedSecondName = formatName(valueSecondName)

  const content = {
    key: valueKeyClient,
    id: valueIdClient,
    docId: !isDatosClientes
      ? valueDocId === ''
        ? '21061991'
        : valueDocId
      : valueIdClient,
    rellenadoPor: valueRellenadoPor?.label || '',
    docType: valueDocType?.label || '',
    name: !isDatosClientes ? formattedName : 'Sin nombre',
    secondName: !isDatosClientes ? formattedSecondName : '',
    canalLlegada: valueCanalLlegada?.label || '',
    bookingNumber: valueBookingNumber,
    tipoAlquiler: valueTipoAlquiler?.label || '',
    habitacion: valueHabitacion?.label || '',
    medioDePago: valueMedioPago?.label || '',
    precio: formattedPrecio,
    cantidadPersonas: parseInt(valueCantidadPersonas, 10),
    cantidadDias: formattedCantidadDias,
    fechaHospedaje: formattedFechaHospedaje,
    fechaRegistro: serverTimestamp(),
    avatar: 'https://i.pravatar.cc/150?u=' + valueDocId
  }

  const guardar_detalle = async () => {
    const db = getFirestore()
    const id = doc(collection(db, 'hospedaje'), Content.key)
    try {
      await updateDoc(id, content)
      handleContentChange(JSON.stringify(content))
    } catch (error) {}
    handleDetalle()
  }

  const guardar_atras = async () => {
    const db = getFirestore()
    const id = doc(collection(db, 'hospedaje'), Content.key)
    try {
      await updateDoc(id, content)
      handleContentChange(JSON.stringify(content))
    } catch (error) {}
    handleReporte()
  }

  return (
    <form>
      <div className='border-b pb-10'>
        <div className='mt-5 grid grid-cols-1 gap-x-6 gap-y-8 pt-5 sm:grid-cols-9'>
          <div className='py-4 sm:col-span-5'>
            <h2 className='font-semibold text-gray-900 dark:text-gray-50'>
              Registro de cliente: {Content.id}
            </h2>
            <p className='leading-1 mt-1 pb-5 text-sm text-gray-600 dark:text-gray-100'>
              Datos del cliente y la habitación.
            </p>
          </div>
          <div className='sm:col-span-4'>
            <Switch
              isSelected={isDatosClientes}
              onValueChange={setIsDatosClientes}
              classNames={{
                base: cn(
                  'inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center',
                  'justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-gray-100',
                  'data-[selected=true]:border-primary'
                ),
                wrapper: 'p-0 h-4 overflow-visible',
                thumb: cn(
                  'w-6 h-6 border-2 shadow-lg',
                  'group-data-[hover=true]:border-primary',
                  //selected
                  'group-data-[selected=true]:ml-6',
                  // pressed
                  'group-data-[pressed=true]:w-7',
                  'group-data-[selected]:group-data-[pressed]:ml-4'
                )
              }}
            >
              <div className='flex flex-col gap-1'>
                <p className='text-medium text-default-600'>
                  Negación del cliente
                </p>
                <p className='text-tiny text-default-400'>
                  Activar si no hay datos cliente.
                </p>
              </div>
            </Switch>
          </div>
          <div className='sm:col-span-3'>
            <Select
              isRequired
              size='md'
              radius='sm'
              labelPlacement='outside'
              variant='faded'
              label='Rellenado por:'
              className='w-full'
              selectedKeys={valueRellenadoPor ? [valueRellenadoPor.value] : []}
              onChange={handleSelectionChangeRellenadoPor}
            >
              {rellenadoPor.map(rellenado => (
                <SelectItem key={rellenado.value} value={rellenado.value}>
                  {rellenado.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          {!isDatosClientes && (
            <>
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
              <div className='sm:col-span-4'>
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
              <div className='sm:col-span-5'>
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

              <div className='sm:col-span-4'>
                <Select
                  isRequired
                  size='md'
                  radius='sm'
                  labelPlacement='outside'
                  variant='faded'
                  label='¿Cómo conoció HS Gol?'
                  className='w-full'
                  selectedKeys={
                    valueCanalLlegada ? [valueCanalLlegada.value] : []
                  }
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

              <div className='sm:col-span-5'>
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
            </>
          )}
          <div className='col-span-full'>
            <Divider className='my-2' />
          </div>

          <div className='sm:col-span-3 sm:col-start-1'>
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
              label='Cantidad personas'
              type='number'
              key='cantidadPersonas'
              valueDocId={valueCantidadPersonas}
              setValueDocId={setValueCantidadPersonas}
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

          <div className='col-span-full'>
            <Divider className='my-2' />
          </div>

          <div className='sm:col-span-3'>
            <Select
              isRequired
              size='md'
              radius='sm'
              labelPlacement='outside'
              variant='faded'
              label='Medio de pago'
              className='w-full'
              selectedKeys={valueMedioPago ? [valueMedioPago.value] : []}
              onChange={handleSelectionMedioPago}
            >
              {medioPago.map(medio => (
                <SelectItem key={medio.value} value={medio.value}>
                  {medio.label}
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
        <Button
          color='default'
          size='sm'
          radius='sm'
          variant='flat'
          onClick={() => {
            guardar_atras()
          }}
        >
          Cancelar
        </Button>
        <Button
          color='primary'
          size='sm'
          radius='sm'
          variant='solid'
          onClick={() => {
            guardar_detalle()
          }}
        >
          Guardar
        </Button>
      </div>
    </form>
  )
}
