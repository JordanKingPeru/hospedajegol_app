'use client'

// External imports
import { useState, useEffect } from 'react'
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

// Internal imports
import FormHsGol from './components/form/resultForm'
import FormHsGolClient from './components/form/formClient'
import DashboardHsGol from './components/dashboard/dashboard'
import FormHsGolClientSkeleton from './components/form/formClientSkeleton'

export default function Home() {
  // State hooks
  const [valueViewState, setValueViewState] = useState<string>('reporte')
  const [valueKeyClient, setValueKeyClient] = useState('')
  const [valueIdClient, setValueIdClient] = useState('')
  const [isContentReady, setIsContentReady] = useState(false)
  const [valueContent, setValueContent] = useState('')
  const [loading, setLoading] = useState(false)

  // useEffect to watch for changes in valueContent
  useEffect(() => {
    if (valueContent) {
      setIsContentReady(true)
    }
  }, [valueContent])

  // Define a function to determine which tabs to disable based on the current view
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
  // Helper functions
  const nuevoRegistro = async () => {
    setLoading(true) // Iniciar el estado de carga
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
      setValueContent(JSON.stringify(content))
      await updateDoc(doc(hospedajeCollection, docIdToUpdate), content)
    } else {
      // Si no existe, creamos uno nuevo
      const id = doc(hospedajeCollection)
      const key = (id as any)._key.path.segments[1]
      setValueIdClient(codigo)
      setValueKeyClient(key)
      content = {
        key: valueKeyClient,
        id: valueIdClient,
        docId: '21061991'
      }
      setValueContent(JSON.stringify(content))
      await setDoc(id, content)
    }
    setLoading(false) // Finalizar el estado de carga una vez que se complete todo
  }

  const handleNewClient = () => {
    if (isContentReady) {
      // Now it's safe to use valueContent
      setValueViewState('cliente')
    }
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
      content: loading ? (
        <FormHsGolClientSkeleton /> // Componente de carga/esqueleto. Deberías tener uno o importar uno que te guste.
      ) : (
        <FormHsGolClient
          valueIdClient={valueIdClient}
          valueKeyClient={valueKeyClient}
          valueContent={valueContent}
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
