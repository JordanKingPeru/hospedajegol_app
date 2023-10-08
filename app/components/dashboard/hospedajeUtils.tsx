export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

import {
  getFirestore,
  collection,
  where,
  getDocs,
  Timestamp,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore'

export const getOneWeekAgoDate = (): Date => {
  const date = new Date()
  date.setDate(date.getDate() - 7)
  return date
}

export const formatTimestampToDate = (timestamp: {
  seconds: number
  nanoseconds: number
}): string => {
  const date = new Date(timestamp.seconds * 1000)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-indexed
  const year = String(date.getFullYear()).slice(-2)

  return `${day}/${month}/${year}`
}

export const formatTimestampToHours = (timestamp: {
  seconds: number
  nanoseconds: number
}): string => {
  const date = new Date(timestamp.seconds * 1000)

  let hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'

  // Convert hours from 24-hour format to 12-hour format
  hours = hours % 12
  // Convert hour '0' to '12'
  hours = hours ? hours : 12

  return `${hours}:${minutes} ${ampm}`
}

type UserHsGol = {
  avatar?: string
  bookingNumber?: string
  canalLlegada?: string
  cantidadDias?: number
  cantidadPersonas?: number
  docId?: string
  docType?: string
  habitacion?: string
  id?: string
  key?: string
  medioDePago?: string
  name?: string
  precio?: number
  rellenadoPor?: string
  secondName?: string
  tipoAlquiler?: string
  fechaHospedaje?: string
  fechaRegistro?: string
}

export const fetchLastWeekData = (
  setDataCallback: (data: UserHsGol[]) => void
) => {
  const db = getFirestore()
  const hospedajeCollection = collection(db, 'hospedaje')

  const lastWeekTimestamp = Timestamp.fromDate(getOneWeekAgoDate())

  const q = query(
    hospedajeCollection,
    where('fechaHospedaje', '>=', lastWeekTimestamp),
    orderBy('fechaHospedaje'),
    orderBy('fechaRegistro', 'desc')
  )

  // Utilizamos onSnapshot para "escuchar" los cambios en los datos en tiempo real
  const unsubscribe = onSnapshot(q, querySnapshot => {
    const data = querySnapshot.docs.map(doc => {
      const item = doc.data()
      return {
        ...item,
        fechaHospedaje:
          formatTimestampToDate(item.fechaHospedaje) +
          ' ' +
          formatTimestampToHours(item.fechaRegistro),
        fechaRegistro:
          formatTimestampToDate(item.fechaRegistro) +
          ' ' +
          formatTimestampToHours(item.fechaRegistro)
      }
    })
    // Usamos el callback para actualizar el estado de los datos en el componente
    setDataCallback(data)
  })

  // La función devuelve una función unsubscribe para limpiar el listener
  return unsubscribe
}
