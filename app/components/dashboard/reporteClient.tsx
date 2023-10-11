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
  CircularProgress,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Divider
} from '@nextui-org/react'
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'
// Asegúrate de importar tus propios iconos o los de @heroicons/react
import {
  PlusIcon,
  EllipsisVerticalIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  UsersIcon
} from '@heroicons/react/24/solid'
import { columnsHsGol, statusOptionsHsGol } from './data'
import { capitalize, FetchLastWeekData } from './hospedajeUtils'
import AccordionHsGol from './incomeAccordion'
import { useViewContext } from '../../ViewContext'
import { typeUserHsGol } from '../typeHsGol'
import { useNuevoRegistro } from './utilsReportClient'

import {
  useCurrentDate,
  isToday,
  isYesterday,
  isThisWeek,
  convertToDate,
  compareUsers,
  generateIncomeByDayOfWeek,
  useFetchDataAndUpdateContent
} from './utilsReportClient'

const statusColorMap: Record<string, ChipProps['color']> = {
  Momentaneo: 'success',
  pornoche: 'danger',
  pormes: 'warning'
}

const INITIAL_VISIBLE_COLUMNS_HSGOL = ['name', 'fechaHospedaje', 'actions']

export default function HospedajeTable() {
  const { setViewState, setContent, isLoading, setLoading } = useViewContext()

  const context = { setViewState, setContent, setLoading }
  const { nuevoRegistro, isContentReady, setIsContentReady } =
    useNuevoRegistro(context)

  const { fetchDataAndUpdateContent } = useFetchDataAndUpdateContent(context)

  const [usersHsGol, setUsersHsGol] = useState<any[]>([])
  //const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null)

  const confirmDelete = (key: string) => {
    setRecordToDelete(key)
    setIsModalOpen(true)
  }

  useEffect(() => {
    const result = FetchLastWeekData(setUsersHsGol)
    setLoading(false)

    return () => result()
  }, [setLoading])

  const deleteRecord = async () => {
    if (!recordToDelete) {
      console.error("No record to delete. This shouldn't happen.")
      return
    }

    const db = getFirestore()
    const id = doc(collection(db, 'hospedaje'), recordToDelete)
    try {
      await deleteDoc(id)
      console.log('Document successfully deleted!')
      // La actualización del estado local ya no es necesaria debido al listener en tiempo real de Firestore
    } catch (error) {
      console.error('Error removing document: ', error)
    } finally {
      setIsModalOpen(false) // Cerrar el modal después de eliminar
      setRecordToDelete(null) // Limpiar el estado
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

  const renderCell = useCallback(
    (user: typeUserHsGol, columnKey: Key) => {
      const cellValue = user[columnKey as keyof typeUserHsGol]

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
            <div className='my-2 flex flex-col'>
              <p className='text-bold text-small capitalize'>{cellValue}</p>
              <p className='text-bold text-tiny capitalize text-default-500'>
                {'S/. ' + user.precio + ' ' + user.medioDePago}
              </p>
              <Divider className='my-2' />
              <Chip
                className='gap-1 border-none capitalize text-default-600'
                color={statusColorMap[user.tipoAlquiler]}
                size='sm'
                variant='dot'
              >
                {user.tipoAlquiler}
              </Chip>
              <p>
                <span className='text-bold text-tiny capitalize text-primary-500'>
                  días: {user.cantidadDias} {'  '}
                  <UsersIcon className='ml-2 inline-block h-4 w-4 text-default-500' />
                  : {user.cantidadPersonas}
                </span>
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
                  <DropdownItem
                    aria-label='Ver'
                    onClick={() => fetchDataAndUpdateContent(user.key)}
                  >
                    Ver
                  </DropdownItem>
                  <DropdownItem aria-label='Editar'>Editar</DropdownItem>
                  <DropdownItem
                    aria-label='Eliminar'
                    onClick={() => confirmDelete(user.key)}
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
    },
    [setContent, setViewState]
  )

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
    return <CircularProgress color='primary' size='lg' label='Cargando...' />
  }
  return (
    <>
      <Table
        isCompact
        isStriped
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
              {columnKey => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal
        isOpen={isModalOpen}
        onOpenChange={() => setIsModalOpen(!isModalOpen)}
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Confirma la eliminación del registro
              </ModalHeader>
              <ModalBody>
                <p>Recuerda que no hay vuelta atrás, una vez eliminado.</p>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  Cancelar
                </Button>
                <Button color='primary' onPress={deleteRecord}>
                  Aceptar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
