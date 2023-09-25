import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp
} from 'firebase/firestore'
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
  CardFooter,
  Image,
  CardBody
} from '@nextui-org/react'
// Asegúrate de importar tus propios iconos o los de @heroicons/react
import {
  PlusIcon,
  EllipsisVerticalIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/solid'
import { columnsHsGol, statusOptionsHsGol } from './data'
import { capitalize } from './utils'

type DashboardHsGolProps = {
  nuevoRegistro: () => void
}
const getOneWeekAgoDate = (): Date => {
  const date = new Date()
  date.setDate(date.getDate() - 7)
  return date
}

const formatTimestampToDate = (timestamp: {
  seconds: number
  nanoseconds: number
}): string => {
  const date = new Date(timestamp.seconds * 1000)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-indexed
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const fetchLastWeekData = async () => {
  const db = getFirestore()
  const hospedajeCollection = collection(db, 'hospedaje')

  // Convertir la fecha a un objeto Timestamp
  const lastWeekTimestamp = Timestamp.fromDate(getOneWeekAgoDate())

  const q = query(
    hospedajeCollection,
    where('fechaHospedaje', '>=', lastWeekTimestamp)
  )
  const querySnapshot = await getDocs(q)

  const data = querySnapshot.docs.map(doc => {
    const item = doc.data()
    return {
      ...item,
      fechaHospedaje: formatTimestampToDate(item.fechaHospedaje),
      fechaRegistro: formatTimestampToDate(item.fechaRegistro)
    }
  })

  return data
}

const statusColorMap: Record<string, ChipProps['color']> = {
  Momentaneo: 'success',
  pornoche: 'danger',
  pormes: 'warning'
}

const INITIAL_VISIBLE_COLUMNS = ['name', 'role', 'status', 'actions']
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

export default function HospedajeTable({ nuevoRegistro }: DashboardHsGolProps) {
  const [usersHsGol, setUsersHsGol] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchLastWeekData()
      setUsersHsGol(result)
      setIsLoading(false)
    }

    fetchData()
  }, [])

  const [filterValue, setFilterValue] = useState('')
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS_HSGOL)
  )

  const [statusFilter, setStatusFilter] = useState<Selection>('all')
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'fechaHospedaje',
    direction: 'ascending'
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

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredItems.slice(start, end)
  }, [page, filteredItems, rowsPerPage])

  const sortedItems = useMemo(() => {
    return [...items].sort((a: UserHsGol, b: UserHsGol) => {
      const first = a[sortDescriptor.column as keyof UserHsGol] as number
      const second = b[sortDescriptor.column as keyof UserHsGol] as number
      const cmp = first < second ? -1 : first > second ? 1 : 0

      return sortDescriptor.direction === 'descending' ? -cmp : cmp
    })
  }, [sortDescriptor, items])

  const renderCell = useCallback((user: UserHsGol, columnKey: Key) => {
    const cellValue = user[columnKey as keyof UserHsGol]

    switch (columnKey) {
      case 'name':
        return (
          <User
            avatarProps={{ radius: 'full', size: 'sm', src: user.avatar }}
            classNames={{
              description: 'text-default-500'
            }}
            description={user.rellenadoPor + ' ' + user.habitacion}
            name={cellValue + ' ' + user.secondName}
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
                <DropdownItem aria-label='Eliminar'>Eliminar</DropdownItem>
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

  const topContent = useMemo(() => {
    // 1. Calcular la suma total de "precio"
    const totalPrecio = usersHsGol.reduce((sum, user) => sum + user.precio, 0)

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
        <div className='flex items-center justify-between'>
          <div className='flex flex-col'>
            <Card isPressable radius='sm'>
              <CardBody className='items-center'>
                <span className='text-small text-default-400'>Clientes</span>
                <span className='text-small text-default-400'>
                  {usersHsGol.length}
                </span>
              </CardBody>
            </Card>
          </div>
          <div className='flex flex-col'>
            <Card isPressable radius='sm'>
              <CardBody className='items-center'>
                <span className='text-small text-default-400'>Ingresos</span>
                <span className='text-small text-default-400'>
                  S/. {totalPrecio.toFixed(1)}
                </span>
              </CardBody>
            </Card>
          </div>
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
    filterValue,
    onSearchChange,
    statusFilter,
    visibleColumns,
    usersHsGol.length,
    onRowsPerPageChange,
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
      <TableBody emptyContent={'No users found'} items={sortedItems}>
        {item => (
          <TableRow key={item.id}>
            {columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
