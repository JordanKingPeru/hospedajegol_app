'use client'

import {
  UserIcon,
  PresentationChartBarIcon,
  HomeModernIcon
} from '@heroicons/react/24/solid'
import { Tabs, Tab, Card, CardBody } from '@nextui-org/react'
import { useViewContext } from './ViewContext'
import FormHsGol from './components/form/resultForm'
import FormHsGolClient from './components/form/formClient'
import DashboardHsGol from './components/dashboard/dashboard'
import FormHsGolClientSkeleton from './components/form/formClientSkeleton'
import { useMemo } from 'react'

export default function Home() {
  const { viewState, setViewState, isLoading } = useViewContext()

  const getDisabledKeys = useMemo(() => {
    switch (viewState) {
      case 'reporte':
        return ['cliente', 'detalle']
      case 'cliente':
        return ['reporte', 'detalle']
      case 'detalle':
        return ['reporte', 'cliente']
      default:
        return []
    }
  }, [viewState])

  const tabs = useMemo(
    () => [
      {
        id: 'reporte',
        label: 'Reporte',
        icon: (
          <PresentationChartBarIcon
            className='text-white-200 mx-auto h-6 w-6'
            aria-hidden='true'
          />
        ),
        content: <DashboardHsGol />
      },
      {
        id: 'cliente',
        label: 'Cliente',
        icon: (
          <UserIcon
            className='text-white-200 mx-auto h-6 w-6'
            aria-hidden='true'
          />
        ),
        content: isLoading ? <FormHsGolClientSkeleton /> : <FormHsGolClient />
      },
      {
        id: 'detalle',
        label: 'Detalle',
        icon: (
          <HomeModernIcon
            className='text-white-200 mx-auto h-6 w-6'
            aria-hidden='true'
          />
        ),
        content: <FormHsGol />
      }
    ],
    [isLoading]
  )

  return (
    <section id='habitacionDisponible' className='py-10'>
      <div className='container flex items-center justify-center'>
        <div className='flex w-full flex-col'>
          <Tabs
            aria-label='Options'
            size='md'
            radius='sm'
            color='primary'
            variant='bordered'
            items={tabs}
            selectedKey={viewState}
            onSelectionChange={key => setViewState(key as string)}
            disabledKeys={getDisabledKeys}
          >
            {item => (
              <Tab
                key={item.id}
                title={
                  <div className='flex items-center space-x-2'>
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                }
              >
                <Card>
                  <CardBody>{item.content}</CardBody>
                </Card>
              </Tab>
            )}
          </Tabs>
        </div>
      </div>
    </section>
  )
}
