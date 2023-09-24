'use client'

// External imports
import { useState, useEffect } from 'react'
import { Tabs, Tab, Card, CardBody, Button } from '@nextui-org/react'
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
    setLoading(true)

    // Cambia la vista aquí
    setValueViewState('cliente') // Iniciar el estado de carga

    const db = getFirestore()
    const hospedajeCollection = collection(db, 'hospedaje')

    // Hacer una consulta para encontrar el documento con docId: "21061991"
    const q = query(hospedajeCollection, where('docId', '==', '21061991'))
    const querySnapshot = await getDocs(q)

    const codigo = Math.random().toString(36).substring(2, 7).toUpperCase()

    if (!querySnapshot.empty) {
      // Si existe un documento con docId: "21061991", actualizamos
      const documentSnapshot = querySnapshot.docs[0]
      const dataSnapshot = documentSnapshot.data()

      const updatedKeyClient = dataSnapshot.key
      const updatedIdClient = dataSnapshot.id

      setValueKeyClient(updatedKeyClient)
      setValueIdClient(updatedIdClient)
      const content = {
        key: dataSnapshot.key,
        id: dataSnapshot.id,
        docId: '21061991',
        rellenadoPor: dataSnapshot.rellenadoPor,
        docType: dataSnapshot.docType,
        name: dataSnapshot.name,
        secondName: dataSnapshot.secondName,
        canalLlegada: dataSnapshot.canalLlegada,
        bookingNumber: dataSnapshot.bookingNumber,
        tipoAlquiler: dataSnapshot.tipoAlquiler,
        habitacion: dataSnapshot.habitacion,
        medioDePago: dataSnapshot.medioDePago,
        precio: dataSnapshot.precio,
        cantidadPersonas: dataSnapshot.cantidadPersonas,
        cantidadDias: dataSnapshot.cantidadDias,
        fechaHospedaje: dataSnapshot.fechaHospedaje,
        fechaRegistro: dataSnapshot.fechaRegistro,
        avatar: dataSnapshot.avatar
      }
      const contentStr = JSON.stringify(content)
      setValueContent(contentStr)
      if (contentStr) {
        setIsContentReady(true)
      }

      await updateDoc(doc(hospedajeCollection, updatedKeyClient), content)
    } else {
      // Si no existe, creamos uno nuevo
      const id = doc(hospedajeCollection)
      const key = (id as any)._key.path.segments[1]
      setValueIdClient(codigo)
      setValueKeyClient(key)
      const content = {
        key: key,
        id: codigo,
        docId: '21061991',
        rellenadoPor: '',
        docType: 'DNI',
        name: '',
        secondName: '',
        canalLlegada: '',
        bookingNumber: '',
        tipoAlquiler: '',
        habitacion: '',
        medioDePago: '',
        precio: '',
        cantidadPersonas: '1',
        cantidadDias: '1',
        fechaHospedaje: '',
        fechaRegistro: '',
        avatar: ''
      }

      const contentStr = JSON.stringify(content)
      setValueContent(contentStr)
      if (contentStr) {
        setIsContentReady(true)
      }
      await setDoc(id, content)
    }

    setLoading(false) // Finalizar el estado de carga una vez que se complete todo
  }

  const handleContentChange = (content: string) => {
    setValueContent(content)
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
      content: <DashboardHsGol nuevoRegistro={nuevoRegistro} />
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
          handleContentChange={handleContentChange}
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
      content: (
        <FormHsGol valueContent={valueContent} handleReporte={handleReporte} />
      )
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
