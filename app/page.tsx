'use client'

// External imports
import { Tabs, Tab, Card, CardBody } from '@nextui-org/react'
import {
  UserIcon,
  PresentationChartBarIcon,
  HomeModernIcon
} from '@heroicons/react/24/solid'
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore'
import { useState } from 'react'

// Internal imports
import FormHsGol from './components/form/resultForm'
import FormHsGolClient from './components/form/formClient'
import DashboardHsGol from './components/dashboard/dashboard'

export default function Home() {
  // State hooks
  const [valueViewState, setValueViewState] = useState<string>('reporte')
  const [valueKeyClient, setValueKeyClient] = useState('')
  const [valueIdClient, setValueIdClient] = useState('')

  // Helper functions
  const nuevoRegistro = async () => {
    const db = getFirestore()
    const hospedajeCollection = collection(db, 'hospedaje')

    // Hacer una consulta para encontrar el documento con docId: "21061991"
    const q = query(hospedajeCollection, where('docId', '==', '21061991'))
    const querySnapshot = await getDocs(q)

    const codigo = Math.random().toString(36).substring(2, 7).toUpperCase()

    let content: { key?: string; id: string; docId: string }

    if (!querySnapshot.empty) {
      // Si existe un documento con docId: "21061991", actualizamos
      const documentSnapshot = querySnapshot.docs[0]
      const docIdToUpdate = documentSnapshot.id
      const dataSnapshot = documentSnapshot.data()
      setValueKeyClient(dataSnapshot.key)
      setValueIdClient(dataSnapshot.id)
      content = {
        id: valueIdClient,
        docId: '21061991',
        key: valueKeyClient
      }
      await updateDoc(doc(hospedajeCollection, docIdToUpdate), content)
    } else {
      // Si no existe, creamos uno nuevo
      const id = doc(hospedajeCollection)
      const key = (id as any)._key.path.segments[1]
      setValueIdClient(codigo)
      setValueKeyClient(key)
      content = {
        key: key,
        id: codigo,
        docId: '21061991'
      }
      await setDoc(id, content)
    }
  }

  const handleNewClient = () => {
    setValueViewState('cliente')
  }

  const handleDetalle = () => {
    setValueViewState('detalle')
  }

  const handleReporte = () => {
    setValueViewState('reporte')
  }

  const handleTabChange = (event: React.FormEvent<HTMLDivElement>) => {
    const selectedKey = (event.target as HTMLDivElement).dataset.key
    if (selectedKey) {
      setValueViewState(selectedKey)
    }
  }

  type Key = string | number

  const handleSelectionChange = (selectedKey: Key) => {
    if (typeof selectedKey === 'string') {
      setValueViewState(selectedKey)
    }
  }

  let tabs = [
    {
      id: 'reporte',
      label: 'Reporte',
      icon: (
        <PresentationChartBarIcon
          className='text-white-200 mx-auto h-6 w-6'
          aria-hidden='true'
        />
      ),
      content: (
        <DashboardHsGol
          onNewClient={handleNewClient}
          nuevoRegistro={nuevoRegistro}
        />
      )
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
      content: (
        <FormHsGolClient
          valueIdClient={valueIdClient}
          valueKeyClient={valueKeyClient}
          handleDetalle={handleDetalle}
          handleReporte={handleReporte}
        />
      )
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
  ]

  const getDisabledKeys = (currentView: string): string[] => {
    switch (currentView) {
      case 'reporte':
        return ['cliente', 'detalle']
      case 'cliente':
        return ['reporte', 'detalle']
      case 'detalle':
        return ['reporte', 'cliente']
      default:
        return []
    }
  }

  return (
    <section id='habitacionDisponible' className='py-10'>
      <div className='container flex items-center justify-center '>
        <div className='flex w-full flex-col'>
          <Tabs
            aria-label='Options'
            size='md'
            radius='sm'
            color='primary'
            variant='bordered'
            items={tabs}
            selectedKey={valueViewState}
            onSelectionChange={handleSelectionChange}
            disabledKeys={getDisabledKeys(valueViewState)}
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
