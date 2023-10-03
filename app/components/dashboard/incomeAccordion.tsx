import { Accordion, AccordionItem, Divider } from '@nextui-org/react'
import { MonitorMobileIcon } from './MonitorMobileIcon'
import { UsersIcon } from '@heroicons/react/24/solid'
import { Overview } from './barChartHsGol'

type AppProps = {
  clientesHoy: String | null | undefined
  ingresosHoy: String | null | undefined
  clientesAyer: String | null | undefined
  ingresosAyer: String | null | undefined
  clientesSemana: String | null | undefined
  ingresosSemana: String | null | undefined
  clientesHoyYapeOPlin: String | null | undefined
  ingresosHoyYapeOPlin: String | null | undefined
  clientesHoyEfectivo: String | null | undefined
  ingresosHoyEfectivo: String | null | undefined
  incomeByDayOdWeek: any
}

export default function FormHsGol({
  clientesHoy,
  ingresosHoy,
  clientesAyer,
  ingresosAyer,
  clientesSemana,
  ingresosSemana,
  clientesHoyYapeOPlin,
  ingresosHoyYapeOPlin,
  clientesHoyEfectivo,
  ingresosHoyEfectivo,
  incomeByDayOdWeek
}: AppProps) {
  const itemClasses = {
    base: 'py-0 w-full',
    title: 'font-normal text-medium',
    trigger:
      'px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-14 flex items-center',
    indicator: 'text-medium',
    content: 'text-small px-2'
  }

  const defaultContent = (
    <div>
      <Divider className='my-4' />
      <h2 className='text-default-800'>Hoy</h2>
      <p className='flex items-center'>
        Yape o Plin{' '}
        <span className='ml-2 text-primary'>S/.{ingresosHoyYapeOPlin}</span>
        <UsersIcon className='ml-2 h-4 w-4 text-default-500' />
        <span className='mx-auto ml-2 text-default-500'>
          {clientesHoyYapeOPlin}
        </span>
      </p>
      <p className='flex items-center'>
        Efectivo{' '}
        <span className='ml-2 text-primary'>S/.{ingresosHoyEfectivo}</span>
        <UsersIcon className='ml-2 h-4 w-4 text-default-500' />
        <span className='mx-auto ml-2 text-default-500'>
          {clientesHoyEfectivo}
        </span>
      </p>
      <Divider className='my-4' />
      <p className='flex items-center'>
        Ayer <span className='ml-2 text-primary'>S/.{ingresosAyer}</span>
        <UsersIcon className='ml-2 h-4 w-4 text-default-500' />
        <span className='mx-auto ml-2 text-default-500'>{clientesAyer}</span>
      </p>
      <p className='flex items-center'>
        Semana <span className='ml-2 text-primary'>S/.{ingresosSemana}</span>
        <UsersIcon className='ml-2 h-4 w-4 text-default-500' />
        <span className='mx-auto ml-2 text-default-500'>{clientesSemana}</span>
      </p>
      <Divider className='my-4' />
      <div className='text-primary'>Evolución ingreso semanal</div>

      <Overview incomeByDayOdWeek={incomeByDayOdWeek} />

      <Divider className='my-4' />
      <iframe
        width='365'
        height='300'
        src='https://lookerstudio.google.com/embed/reporting/a1914868-403e-410b-af1d-69f9a0609325/page/IiOeD'
        style={{ border: 0 }}
        allowFullScreen
      ></iframe>
    </div>
  )

  return (
    <Accordion
      showDivider={false}
      className='flex w-full max-w-[400px] flex-col gap-1 p-2'
      variant='shadow'
      itemClasses={itemClasses}
    >
      <AccordionItem
        key='1'
        aria-label='Clientes hoy'
        startContent={<MonitorMobileIcon className='text-primary' />}
        subtitle={
          <p className='flex'>
            Ingresos <p className='ml-1 text-primary'>S/. {ingresosHoy}</p>
          </p>
        }
        title={'Clientes hoy: ' + clientesHoy}
      >
        {defaultContent}
      </AccordionItem>
    </Accordion>
  )
}
