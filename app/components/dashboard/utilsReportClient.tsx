import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  setDoc
} from 'firebase/firestore'
import { typeUserHsGol } from '../typeHsGol'
import { SortDescriptor } from '@nextui-org/react'
import { useState } from 'react'

export const useFetchDataAndUpdateContent = (context: any) => {
  const fetchDataAndUpdateContent = async (key: string) => {
    const { setViewState, setContent, setLoading } = context
    setLoading(true)

    const db = getFirestore()
    const hospedajeCollection = collection(db, 'hospedaje')

    // Hacer una consulta para encontrar el documento con docId: "21061991"
    const q = query(hospedajeCollection, where('key', '==', key))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      // Si existe un documento con docId: "21061991", actualizamos
      const documentSnapshot = querySnapshot.docs[0]
      const valueContent = documentSnapshot.data()

      const content = {
        key: valueContent.key,
        id: valueContent.id,
        docId: valueContent.docId,
        rellenadoPor: valueContent.rellenadoPor,
        docType: valueContent.docType,
        name: valueContent.name,
        secondName: valueContent.secondName,
        canalLlegada: valueContent.canalLlegada,
        bookingNumber: valueContent.bookingNumber,
        tipoAlquiler: valueContent.tipoAlquiler,
        habitacion: valueContent.habitacion,
        medioDePago: valueContent.medioDePago,
        precio: valueContent.precio,
        cantidadPersonas: valueContent.cantidadPersonas,
        cantidadDias: valueContent.cantidadDias,
        fechaHospedaje: valueContent.fechaHospedaje,
        fechaRegistro: valueContent.fechaRegistro,
        avatar: valueContent.avatar
      }
      const contentStr = JSON.stringify(content)
      console.log(contentStr)
      setContent(contentStr)
      setViewState('cliente')
    } else {
      // Si el documento no existe, puedes manejarlo de la manera que prefieras
      // Por ejemplo, puedes establecer un contenido predeterminado o lanzar un error
      console.error(`No document found with key: ${key}`)
    }
    // Finalizar el estado de carga una vez que se complete todo
    setLoading(false)
  }
  return { fetchDataAndUpdateContent }
}

export const useNuevoRegistro = (context: any) => {
  const [isContentReady, setIsContentReady] = useState(false)

  const nuevoRegistro = async () => {
    const { setViewState, setContent, setLoading } = context

    setLoading(true)

    // Cambia la vista aquí
    setViewState('cliente') // Iniciar el estado de carga

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
      setContent(contentStr)
      if (contentStr) {
        setIsContentReady(true)
      }

      await updateDoc(doc(hospedajeCollection, dataSnapshot.key), content)
    } else {
      // Si no existe, creamos uno nuevo
      const id = doc(hospedajeCollection)
      const key = (id as any)._key.path.segments[1]
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
        precio: '0',
        cantidadPersonas: '1',
        cantidadDias: '1',
        fechaHospedaje: '',
        fechaRegistro: '',
        avatar: ''
      }

      const contentStr = JSON.stringify(content)
      setContent(contentStr)
      if (contentStr) {
        setIsContentReady(true)
      }
      await setDoc(id, content)
    }

    setLoading(false) // Finalizar el estado de carga una vez que se complete todo
  }
  return { nuevoRegistro, isContentReady, setIsContentReady }
}

export const useCurrentDate = () => {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const firstDayOfWeek = new Date(today)
  firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay())

  return { today, yesterday, firstDayOfWeek }
}

export const isToday = (fechaHospedaje: string, today: Date) => {
  const [fecha, hora] = fechaHospedaje.split(' ')
  const date = convertToDate(fecha, hora)
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

export const isYesterday = (fechaHospedaje: string, yesterday: Date) => {
  const [fecha, hora] = fechaHospedaje.split(' ')
  const date = convertToDate(fecha, hora)
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  )
}

export const isThisWeek = (fechaHospedaje: string, firstDayOfWeek: Date) => {
  const [fecha, hora] = fechaHospedaje.split(' ')
  const date = convertToDate(fecha, hora)
  return date >= firstDayOfWeek
}

export const convertToDate = (fecha: string, hora: string) => {
  const [day, month, year] = fecha.split('/').map(Number)
  const fullYear = year > 50 ? 1900 + year : 2000 + year // Asumimos que cualquier año mayor a 50 pertenece al siglo 20
  let [hours, minutes] = hora.split(':').map(Number)
  const isPM = hora.includes('PM')

  if (isPM && hours !== 12) hours += 12
  if (!isPM && hours === 12) hours = 0

  const resultDate = new Date(fullYear, month - 1, day, hours, minutes)
  return resultDate
}

export const compareUsers = (
  a: typeUserHsGol,
  b: typeUserHsGol,
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
    const first = a[sortDescriptor.column as keyof typeUserHsGol] as number
    const second = b[sortDescriptor.column as keyof typeUserHsGol] as number
    const cmp = first < second ? -1 : first > second ? 1 : 0
    return sortDescriptor.direction === 'descending' ? -cmp : cmp
  }
}

export const generateIncomeByDayOfWeek = (users: typeUserHsGol[]): any[] => {
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
