import {
  ChangeEvent,
  Key,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
  Card,
  CardBody
} from '@nextui-org/react'

import {
  getFirestore,
  doc,
  Timestamp,
  collection,
  updateDoc,
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore'
// Asegúrate de importar tus propios iconos o los de @heroicons/react
import {
  PlusIcon,
  EllipsisVerticalIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/solid'
import { columnsHsGol, statusOptionsHsGol } from './data'
import { capitalize, fetchLastWeekData } from './hospedajeUtils'
import AccordionHsGol from './incomeAccordion'

type DashboardHsGolProps = {
  nuevoRegistro: () => void
}

const statusColorMap: Record<string, ChipProps['color']> = {
  Momentaneo: 'success',
  pornoche: 'danger',
  pormes: 'warning'
}

const INITIAL_VISIBLE_COLUMNS_HSGOL = [
  'name',
  'fechaHospedaje',
  'tipoAlquiler',
  'actions'
]

type UserHsGol = {
  avatar: string
  bookingNumber: string
  canalLlegada: string
  cantidadDias: number
  cantidadPersonas: number
  docId: string
  docType: string
  fechaHospedaje: string
  fechaRegistro: string
  habitacion: string
  id: string
  key: string
  medioDePago: string
  name: string
  precio: number
  rellenadoPor: string
  secondName: string
  tipoAlquiler: string
}

const compareUsers = (
  a: UserHsGol,
  b: UserHsGol,
  sortDescriptor: SortDescriptor
): number => {
  if (sortDescriptor.column === 'fechaHospedaje') {
    const [aDate, aTime] = a.fechaHospedaje.split(' ')
    const [bDate, bTime] = b.fechaHospedaje.split(' ')
    const aTimestamp = convertToDate(aDate, aTime)
    const bTimestamp = convertToDate(bDate, bTime)
    const cmp = aTimestamp < bTimestamp ? -1 : aTimestamp > bTimestamp ? 1 : 0
    return sortDescriptor.direction === 'descending' ? -cmp : cmp
  } else {
    const first = a[sortDescriptor.column as keyof UserHsGol] as number
    const second = b[sortDescriptor.column as keyof UserHsGol] as number
    const cmp = first < second ? -1 : first > second ? 1 : 0
    return sortDescriptor.direction === 'descending' ? -cmp : cmp
  }
}

const useCurrentDate = () => {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const firstDayOfWeek = new Date(today)
  firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay())

  return { today, yesterday, firstDayOfWeek }
}

const isToday = (fechaHospedaje: string, today: Date) => {
  const [fecha, hora] = fechaHospedaje.split(' ')
  const date = convertToDate(fecha, hora)
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

const isYesterday = (fechaHospedaje: string, yesterday: Date) => {
  const [fecha, hora] = fechaHospedaje.split(' ')
  const date = convertToDate(fecha, hora)
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  )
}

const isThisWeek = (fechaHospedaje: string, firstDayOfWeek: Date) => {
  const [fecha, hora] = fechaHospedaje.split(' ')
  const date = convertToDate(fecha, hora)
  return date >= firstDayOfWeek
}
const convertToDate = (fecha: string, hora: string) => {
  const [day, month, year] = fecha.split('/').map(Number)
  const fullYear = year > 50 ? 1900 + year : 2000 + year // Asumimos que cualquier año mayor a 50 pertenece al siglo 20
  let [hours, minutes] = hora.split(':').map(Number)
  const isPM = hora.includes('PM')

  if (isPM && hours !== 12) hours += 12
  if (!isPM && hours === 12) hours = 0

  const resultDate = new Date(fullYear, month - 1, day, hours, minutes)
  return resultDate
}

const generateIncomeByDayOfWeek = (users: UserHsGol[]): any[] => {
  // Actualizar el arreglo de días de la semana al español y comenzando en lunes
  const daysOfWeek = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom']

  // Actualizar las claves del objeto incomeMap para que coincidan con los nombres de los días en español
  const incomeMap: Record<string, number> = {
    lun: 0,
    mar: 0,
    mie: 0,
    jue: 0,
    vie: 0,
    sab: 0,
    dom: 0
  }

  users.forEach(user => {
    const [fecha, hora] = user.fechaHospedaje.split(' ')
    const date = convertToDate(fecha, hora)

    // Ajustar el índice para comenzar en lunes en lugar de domingo
    let dayIndex = date.getDay() - 1
    if (dayIndex === -1) dayIndex = 6

    const dayName = daysOfWeek[dayIndex]
    incomeMap[dayName] += user.precio
  })

  return daysOfWeek.map(day => ({
    diaSemana: day,
    ingresos: incomeMap[day]
  }))
}

export default function HospedajeTable({ nuevoRegistro }: DashboardHsGolProps) {
  const [usersHsGol, setUsersHsGol] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const result = fetchLastWeekData(setUsersHsGol)
    setIsLoading(false)

    return () => result()
  }, [])

  const deleteRecord = async (key: string | undefined) => {
    const db = getFirestore()
    const id = doc(collection(db, 'hospedaje'), key)
    try {
      await deleteDoc(id)
      console.log('Document successfully deleted!')
      // La actualización del estado local ya no es necesaria debido al listener en tiempo real de Firestore
    } catch (error) {
      console.error('Error removing document: ', error)
    }
  }

  const [filterValue, setFilterValue] = useState('')
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS_HSGOL)
  )

  const [statusFilter, setStatusFilter] = useState<Selection>('all')
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'fechaHospedaje',
    direction: 'descending'
  })

  const [page, setPage] = useState(1)

  const pages = Math.ceil(usersHsGol.length / rowsPerPage)

  const hasSearchFilter = Boolean(filterValue)

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columnsHsGol

    return columnsHsGol.filter(column =>
      Array.from(visibleColumns).includes(column.uid)
    )
  }, [visibleColumns])

  const filteredItems = useMemo(() => {
    let filteredUsers = [...usersHsGol]

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(filterValue.toLowerCase())
      )
    }
    if (
      statusFilter !== 'all' &&
      Array.from(statusFilter).length !== statusOptionsHsGol.length
    ) {
      filteredUsers = filteredUsers.filter(user =>
        Array.from(statusFilter).includes(user.tipoAlquiler)
      )
    }

    return filteredUsers
  }, [usersHsGol, hasSearchFilter, statusFilter, filterValue])

  const sortedAndFilteredItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => compareUsers(a, b, sortDescriptor))
  }, [sortDescriptor, filteredItems])

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage
    return sortedAndFilteredItems.slice(start, end)
  }, [page, sortedAndFilteredItems, rowsPerPage])

  const renderCell = useCallback((user: UserHsGol, columnKey: Key) => {
    const cellValue = user[columnKey as keyof UserHsGol]

    switch (columnKey) {
      case 'name':
        return (
          <User
            avatarProps={{ radius: 'full', size: 'sm', src: user.avatar }}
            classNames={{
              description: 'text-default-400',
              name: 'text-default-600'
            }}
            description={user.rellenadoPor + ' ' + user.habitacion}
            name={cellValue}
          >
            {user.rellenadoPor + ' ' + user.habitacion}
          </User>
        )
      case 'fechaHospedaje':
        return (
          <div className='flex flex-col'>
            <p className='text-bold text-small capitalize'>{cellValue}</p>
            <p className='text-bold text-tiny capitalize text-default-500'>
              {'S/. ' + user.precio + ' ' + user.medioDePago}
            </p>
          </div>
        )
      case 'tipoAlquiler':
        return (
          <div className='flex flex-col'>
            <Chip
              className='gap-1 border-none capitalize text-default-600'
              color={statusColorMap[user.tipoAlquiler]}
              size='sm'
              variant='dot'
            >
              {cellValue}
            </Chip>
            <p className='text-bold text-tiny capitalize text-default-500'>
              Nro días: {user.cantidadDias} - Nro personas:{' '}
              {user.cantidadPersonas}
            </p>
          </div>
        )
      case 'actions':
        console.log(user.key)
        return (
          <div className='relative flex items-center justify-end gap-2'>
            <Dropdown className='border-1 border-default-200 bg-background'>
              <DropdownTrigger>
                <Button
                  aria-label='Detalle'
                  isIconOnly
                  radius='full'
                  size='sm'
                  variant='light'
                >
                  <EllipsisVerticalIcon className='text-default-400' />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem aria-label='Ver'>Ver</DropdownItem>
                <DropdownItem aria-label='Editar'>Editar</DropdownItem>
                <DropdownItem
                  aria-label='Eliminar'
                  onClick={() => deleteRecord(user.key)}
                >
                  Eliminar
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        )
      default:
        return cellValue
    }
  }, [])

  const onRowsPerPageChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value))
      setPage(1)
    },
    []
  )

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value)
      setPage(1)
    } else {
      setFilterValue('')
    }
  }, [])

  const { today, yesterday, firstDayOfWeek } = useCurrentDate()

  const topContent = useMemo(() => {
    // 1. Calcular la suma total de "precio"
    const todayUsers = usersHsGol.filter(user =>
      isToday(user.fechaHospedaje, today)
    )

    const clientesHoy = todayUsers.length
    const ingresosHoy = todayUsers.reduce((sum, user) => sum + user.precio, 0)

    // Calculating for yesterday
    const yesterdayUsers = usersHsGol.filter(user =>
      isYesterday(user.fechaHospedaje, yesterday)
    )
    const clientesAyer = yesterdayUsers.length
    const ingresosAyer = yesterdayUsers.reduce(
      (sum, user) => sum + user.precio,
      0
    )

    // Calculating for this week
    const thisWeekUsers = usersHsGol.filter(user =>
      isThisWeek(user.fechaHospedaje, firstDayOfWeek)
    )
    const clientesSemana = thisWeekUsers.length
    const ingresosSemana = thisWeekUsers.reduce(
      (sum, user) => sum + user.precio,
      0
    )

    const todayUsersYapeOPlin = todayUsers.filter(
      user => user.medioDePago === 'Yape o Plin'
    )

    // Calcular clientes y ingresos de hoy que pagaron mediante Yape o Plin
    const clientesHoyYapeOPlin = todayUsersYapeOPlin.length
    const ingresosHoyYapeOPlin = todayUsersYapeOPlin.reduce(
      (sum, user) => sum + user.precio,
      0
    )

    const todayUsersEfectivo = todayUsers.filter(
      user => user.medioDePago === 'Efectivo'
    )

    // Calcular clientes y ingresos de hoy que pagaron mediante Yape o Plin
    const clientesHoyEfectivo = todayUsersEfectivo.length
    const ingresosHoyEfectivo = todayUsersEfectivo.reduce(
      (sum, user) => sum + user.precio,
      0
    )

    const incomeByDayOdWeek = generateIncomeByDayOfWeek(usersHsGol)

    return (
      <div className='flex flex-col gap-4'>
        <div className='flex items-end justify-between gap-3'>
          <Input
            isClearable
            classNames={{
              base: 'w-full sm:max-w-[44%]',
              inputWrapper: 'border-1',
              input: 'text-default-500 border-none bg-transparent'
            }}
            placeholder='Buscar cliente'
            size='sm'
            startContent={
              <MagnifyingGlassIcon className='mx-auto h-6 w-6 text-default-300' />
            }
            value={filterValue}
            variant='bordered'
            onClear={() => setFilterValue('')}
            onValueChange={onSearchChange}
          />
          <div className='flex gap-3'>
            <Dropdown>
              <DropdownTrigger className='hidden sm:flex'>
                <Button
                  endContent={
                    <ChevronDownIcon className='mx-auto h-6 w-6 text-default-300' />
                  }
                  size='sm'
                  variant='flat'
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label='Table Columns'
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode='multiple'
                onSelectionChange={setStatusFilter}
              >
                {statusOptionsHsGol.map(status => (
                  <DropdownItem key={status.uid} className='capitalize'>
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className='hidden sm:flex'>
                <Button
                  endContent={
                    <ChevronDownIcon className='mx-auto h-6 w-6 text-default-300' />
                  }
                  size='sm'
                  variant='flat'
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label='Table Columns'
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode='multiple'
                onSelectionChange={setVisibleColumns}
              >
                {columnsHsGol.map(column => (
                  <DropdownItem key={column.uid} className='capitalize'>
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              color='primary'
              endContent={
                <PlusIcon className='mx-auto h-6 w-6 text-default-300' />
              }
              size='sm'
              onClick={() => {
                nuevoRegistro()
              }}
            >
              Nuevo cliente
            </Button>
          </div>
        </div>
        <div className='grid-cols-1  sm:grid-cols-9'>
          <div className='sm:col-span-8'>
            <AccordionHsGol
              clientesHoy={clientesHoy.toString()}
              ingresosHoy={ingresosHoy.toFixed(0)}
              clientesHoyYapeOPlin={clientesHoyYapeOPlin.toString()}
              ingresosHoyYapeOPlin={ingresosHoyYapeOPlin.toFixed(0)}
              clientesHoyEfectivo={clientesHoyEfectivo.toString()}
              ingresosHoyEfectivo={ingresosHoyEfectivo.toFixed(0)}
              clientesAyer={clientesAyer.toString()}
              ingresosAyer={ingresosAyer.toFixed(0)}
              clientesSemana={clientesSemana.toString()}
              ingresosSemana={ingresosSemana.toFixed(0)}
              incomeByDayOdWeek={incomeByDayOdWeek}
            />
          </div>
        </div>
        <div className='flex items-center justify-end'>
          <label className='flex items-center text-small text-default-400'>
            Filas:
            <select
              className='border-0 bg-transparent text-small text-default-400 outline-none'
              onChange={onRowsPerPageChange}
            >
              <option value='5'>5</option>
              <option value='10'>10</option>
              <option value='15'>15</option>
            </select>
          </label>
        </div>
      </div>
    )
  }, [
    usersHsGol,
    filterValue,
    onSearchChange,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    today,
    yesterday,
    firstDayOfWeek,
    nuevoRegistro
  ])

  const bottomContent = useMemo(() => {
    return (
      <div className='flex items-center justify-between px-2 py-2'>
        <Pagination
          showControls
          classNames={{
            cursor: 'bg-foreground text-background'
          }}
          color='primary'
          isDisabled={hasSearchFilter}
          page={page}
          total={pages}
          variant='light'
          onChange={setPage}
        />
        <span className='text-small text-default-400'>
          {selectedKeys === 'all'
            ? 'All items selected'
            : `${selectedKeys.size} of ${items.length} selected`}
        </span>
      </div>
    )
  }, [selectedKeys, items.length, page, pages, hasSearchFilter])

  const classNames = useMemo(
    () => ({
      wrapper: ['max-h-[382px]', 'max-w-3xl'],
      th: ['bg-transparent', 'text-default-500', 'border-b', 'border-divider'],
      td: [
        // changing the rows border radius
        // first
        'group-data-[first=true]:first:before:rounded-none',
        'group-data-[first=true]:last:before:rounded-none',
        // middle
        'group-data-[middle=true]:before:rounded-none',
        // last
        'group-data-[last=true]:first:before:rounded-none',
        'group-data-[last=true]:last:before:rounded-none'
      ]
    }),
    []
  )
  if (isLoading) {
    return <p>Loading...</p>
  }
  return (
    <Table
      isCompact
      removeWrapper
      aria-label='Example table with custom cells, pagination and sorting'
      bottomContent={bottomContent}
      bottomContentPlacement='outside'
      checkboxesProps={{
        classNames: {
          wrapper: 'after:bg-foreground after:text-background text-background'
        }
      }}
      classNames={classNames}
      selectedKeys={selectedKeys}
      selectionMode='single'
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement='outside'
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {column => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'actions' ? 'center' : 'start'}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={'No users found'} items={items}>
        {item => (
          <TableRow key={item.id}>
            {columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
