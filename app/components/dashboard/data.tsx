export const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'NAME', uid: 'name', sortable: true },
  { name: 'AGE', uid: 'age', sortable: true },
  { name: 'ROLE', uid: 'role', sortable: true },
  { name: 'TEAM', uid: 'team' },
  { name: 'EMAIL', uid: 'email' },
  { name: 'STATUS', uid: 'status', sortable: true },
  { name: 'ACTIONS', uid: 'actions' }
]
export const columnsHsGol = [
  { name: 'ID', uid: 'id' },
  { name: 'RESPONSABLE', uid: 'rellenadoPor', sortable: true },
  { name: 'TIPO DOC', uid: 'docType', sortable: true },
  { name: 'NUM DOC', uid: 'docId' },
  { name: 'NOMBRE', uid: 'name' },
  { name: 'APELLIDO', uid: 'secondName', sortable: true },
  { name: 'FECHA REGISTRO', uid: 'fechaRegistro', sortable: true },
  { name: 'FECHA HOSPEDAJE', uid: 'fechaHospedaje' },
  { name: 'CANAL', uid: 'canalLlegada' },
  { name: 'PRECIO', uid: 'precio', sortable: true },
  { name: 'DÍAS', uid: 'cantidadDias' },
  { name: 'MEDIO', uid: 'medioDePago' },
  { name: 'NRO HABITACIÓN', uid: 'habitacion' },
  { name: 'CANT PERSONAS', uid: 'cantidadPersonas' },
  { name: 'TIPO SERVICIO', uid: 'tipoAlquiler' },
  { name: 'BOOKING', uid: 'bookingNumber' },
  { name: 'ACTIONS', uid: 'actions' },
  { name: 'STATUS', uid: 'status', sortable: true }
]

export const statusOptions = [
  { name: 'Active', uid: 'active' },
  { name: 'Paused', uid: 'paused' },
  { name: 'Vacation', uid: 'vacation' }
]

export const statusOptionsHsGol = [
  { name: 'Momentaneo', uid: 'Momentaneo' },
  { name: 'Por noche', uid: 'pornoche' },
  { name: 'Por mes', uid: 'pormes' }
]

export const usersHsGol = [
  {
    avatar: 'https://i.pravatar.cc/150?u=4',
    bookingNumber: '1234567892',
    canalLlegada: 'Vivo, estudio o trabajo cerca',
    cantidadDias: 1,
    cantidadPersonas: 2,
    docId: '70690276',
    docType: 'DNI',
    fechaHospedaje: '22/09/2023',
    fechaRegistro: '23/09/2023',
    habitacion: '204',
    id: 'JFCBW',
    key: '4pL1N1WzfFcNETfZab92',
    medioDePago: 'Tarjeta de Crédito',
    name: 'Jordan',
    precio: 58,
    rellenadoPor: 'Jordan Rodriguez',
    secondName: 'Rodriguez',
    tipoAlquiler: 'Momentaneo'
  },
  {
    avatar: 'https://i.pravatar.cc/150?u=3',
    bookingNumber: '',
    canalLlegada: '',
    cantidadDias: 1,
    cantidadPersonas: 1,
    docId: '20119607',
    docType: 'DNI',
    fechaHospedaje: '22/09/2023',
    fechaRegistro: '22/09/2023',
    habitacion: '102',
    id: 'D6WNY',
    key: 'j3LEYkksgYXc4pQfsqpP',
    medioDePago: 'Efectivo',
    name: 'Ñuñez',
    precio: 40,
    rellenadoPor: 'Rosa Mallqui',
    secondName: ' Rodtiguez',
    tipoAlquiler: 'Momentaneo'
  },
  {
    avatar: 'https://i.pravatar.cc/150?u=2',
    bookingNumber: '',
    canalLlegada: '',
    cantidadDias: 1,
    cantidadPersonas: 1,
    docId: '72443922',
    docType: 'DNI',
    fechaHospedaje: '22/09/2023',
    fechaRegistro: '22/09/2023',
    habitacion: '103',
    id: 'OU1VE',
    key: 'v8LIWwLUBV4n4kBHFxTJ',
    medioDePago: 'Efectivo',
    name: 'Mayco',
    precio: 20,
    rellenadoPor: 'Rosa Mallqui',
    secondName: 'Rodriguez',
    tipoAlquiler: 'Momentaneo'
  },
  {
    avatar: 'https://i.pravatar.cc/150?u=1',
    bookingNumber: '1234567894',
    canalLlegada: 'Búsqueda en Internet',
    cantidadDias: 1,
    cantidadPersonas: 2,
    docId: '44725119',
    docType: 'DNI',
    fechaHospedaje: '23/09/2023',
    fechaRegistro: '24/09/2023',
    habitacion: '205',
    id: 'YM5O5',
    key: 'DC8dSIwvmyXJiElRqChR',
    medioDePago: 'Yape o Plin',
    name: 'Cristina',
    precio: 58,
    rellenadoPor: 'Jordan Rodriguez',
    secondName: 'Rodriguez',
    tipoAlquiler: 'Momentaneo'
  },
  {
    avatar: 'https://i.pravatar.cc/150?u=',
    bookingNumber: '1234567891',
    canalLlegada: 'Booking.com',
    cantidadDias: 1,
    cantidadPersonas: 3,
    docId: '21061991',
    docType: 'DNI',
    fechaHospedaje: '24/09/2023',
    fechaRegistro: '24/09/2023',
    habitacion: '204',
    id: 'HFPME',
    key: '3OmqNddTKLAzPqZjviDo',
    medioDePago: 'Tarjeta de Crédito',
    name: 'Abigail',
    precio: 95,
    rellenadoPor: 'Jordan Rodriguez',
    secondName: 'Rodriguez',
    tipoAlquiler: 'Momentaneo'
  }
]

export const users = [
  {
    id: 1,
    name: 'Tony Reichert',
    role: 'CEO',
    team: 'Management',
    status: 'active',
    age: '29',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    email: 'tony.reichert@example.com'
  },
  {
    id: 2,
    name: 'Zoey Lang',
    role: 'Tech Lead',
    team: 'Development',
    status: 'paused',
    age: '25',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    email: 'zoey.lang@example.com'
  },
  {
    id: 3,
    name: 'Jane Fisher',
    role: 'Sr. Dev',
    team: 'Development',
    status: 'active',
    age: '22',
    avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
    email: 'jane.fisher@example.com'
  },
  {
    id: 4,
    name: 'William Howard',
    role: 'C.M.',
    team: 'Marketing',
    status: 'vacation',
    age: '28',
    avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d',
    email: 'william.howard@example.com'
  },
  {
    id: 5,
    name: 'Kristen Copper',
    role: 'S. Manager',
    team: 'Sales',
    status: 'active',
    age: '24',
    avatar: 'https://i.pravatar.cc/150?u=a092581d4ef9026700d',
    email: 'kristen.cooper@example.com'
  },
  {
    id: 6,
    name: 'Brian Kim',
    role: 'P. Manager',
    team: 'Management',
    age: '29',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    email: 'brian.kim@example.com',
    status: 'Active'
  },
  {
    id: 7,
    name: 'Michael Hunt',
    role: 'Designer',
    team: 'Design',
    status: 'paused',
    age: '27',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29027007d',
    email: 'michael.hunt@example.com'
  },
  {
    id: 8,
    name: 'Samantha Brooks',
    role: 'HR Manager',
    team: 'HR',
    status: 'active',
    age: '31',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e27027008d',
    email: 'samantha.brooks@example.com'
  },
  {
    id: 9,
    name: 'Frank Harrison',
    role: 'F. Manager',
    team: 'Finance',
    status: 'vacation',
    age: '33',
    avatar: 'https://i.pravatar.cc/150?img=4',
    email: 'frank.harrison@example.com'
  },
  {
    id: 10,
    name: 'Emma Adams',
    role: 'Ops Manager',
    team: 'Operations',
    status: 'active',
    age: '35',
    avatar: 'https://i.pravatar.cc/150?img=5',
    email: 'emma.adams@example.com'
  },
  {
    id: 11,
    name: 'Brandon Stevens',
    role: 'Jr. Dev',
    team: 'Development',
    status: 'active',
    age: '22',
    avatar: 'https://i.pravatar.cc/150?img=8',
    email: 'brandon.stevens@example.com'
  },
  {
    id: 12,
    name: 'Megan Richards',
    role: 'P. Manager',
    team: 'Product',
    status: 'paused',
    age: '28',
    avatar: 'https://i.pravatar.cc/150?img=10',
    email: 'megan.richards@example.com'
  },
  {
    id: 13,
    name: 'Oliver Scott',
    role: 'S. Manager',
    team: 'Security',
    status: 'active',
    age: '37',
    avatar: 'https://i.pravatar.cc/150?img=12',
    email: 'oliver.scott@example.com'
  },
  {
    id: 14,
    name: 'Grace Allen',
    role: 'M. Specialist',
    team: 'Marketing',
    status: 'active',
    age: '30',
    avatar: 'https://i.pravatar.cc/150?img=16',
    email: 'grace.allen@example.com'
  },
  {
    id: 15,
    name: 'Noah Carter',
    role: 'IT Specialist',
    team: 'I. Technology',
    status: 'paused',
    age: '31',
    avatar: 'https://i.pravatar.cc/150?img=15',
    email: 'noah.carter@example.com'
  },
  {
    id: 16,
    name: 'Ava Perez',
    role: 'Manager',
    team: 'Sales',
    status: 'active',
    age: '29',
    avatar: 'https://i.pravatar.cc/150?img=20',
    email: 'ava.perez@example.com'
  },
  {
    id: 17,
    name: 'Liam Johnson',
    role: 'Data Analyst',
    team: 'Analysis',
    status: 'active',
    age: '28',
    avatar: 'https://i.pravatar.cc/150?img=33',
    email: 'liam.johnson@example.com'
  },
  {
    id: 18,
    name: 'Sophia Taylor',
    role: 'QA Analyst',
    team: 'Testing',
    status: 'active',
    age: '27',
    avatar: 'https://i.pravatar.cc/150?img=29',
    email: 'sophia.taylor@example.com'
  },
  {
    id: 19,
    name: 'Lucas Harris',
    role: 'Administrator',
    team: 'Information Technology',
    status: 'paused',
    age: '32',
    avatar: 'https://i.pravatar.cc/150?img=50',
    email: 'lucas.harris@example.com'
  },
  {
    id: 20,
    name: 'Mia Robinson',
    role: 'Coordinator',
    team: 'Operations',
    status: 'active',
    age: '26',
    avatar: 'https://i.pravatar.cc/150?img=45',
    email: 'mia.robinson@example.com'
  }
]
