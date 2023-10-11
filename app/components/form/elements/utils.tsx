import { ChangeEvent } from 'react'

// utils.ts

/**
 * Encuentra un objeto en una lista basada en el valor proporcionado.
 * @param {Array} list - La lista en la que buscar.
 * @param {string} value - El valor para buscar.
 * @return {Object | undefined} - El objeto encontrado o undefined.
 */
export const findItemByValue = (list: any[], value: string) =>
  list.find(item => item.value === value)

/**
 * Maneja el cambio de selección en un elemento de selección.
 * @param {Array} list - La lista de opciones disponibles.
 * @param {Function} setter - La función de establecimiento del estado para actualizar el valor seleccionado.
 * @return {Function} - Una función para manejar el evento de cambio.
 */
export const handleSelectionChange =
  (list: any[], setter: (value: any) => void) =>
  (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedItem = findItemByValue(list, e.target.value)
    if (selectedItem) {
      setter(selectedItem)
    }
  }

/**
 * Valida si un DNI es válido.
 * @param {string} value - El valor del DNI.
 * @return {boolean} - Verdadero si el DNI es válido, falso de lo contrario.
 */
export const validateDNI = (value: string): boolean =>
  !!value.match(/^(?:\d{8})$/)

/**
 * Valida si un número de reserva es válido.
 * @param {string} value - El valor del número de reserva.
 * @return {boolean} - Verdadero si el número de reserva es válido, falso de lo contrario.
 */
export const validateBookingNumber = (value: string): boolean =>
  !!value.match(/^(?:\d{10})$/)

/**
 * Valida si un nombre es válido.
 * @param {string} value - El valor del nombre.
 * @return {boolean} - Verdadero si el nombre es válido, falso de lo contrario.
 */
export const validateName = (value: string): boolean =>
  !!value.match(/^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]+(?:\s[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ]+)*$/)

/**
 * Valida si un precio es válido.
 * @param {string} value - El valor del precio.
 * @return {boolean} - Verdadero si el precio es válido, falso de lo contrario.
 */
export const validatePrecio = (value: string | number): boolean => {
  // Convertimos el valor a cadena si es un número
  const valueStr = typeof value === 'number' ? value.toString() : value

  if (!valueStr) return false

  // La expresión regular ahora permite más dígitos después del punto decimal
  return !!valueStr.match(/^(0|[1-9]\d*)(\.\d+)?$/)
}

/**
 * Valida si una cantidad de días es válida.
 * @param {string} value - El valor de la cantidad de días.
 * @return {boolean} - Verdadero si la cantidad de días es válida, falso de lo contrario.
 */
export const validateCantidadDias = (value: string): boolean => {
  if (!value) return false
  return !!value.match(/^[1-9]\d*$/)
}

/**
 * Formatea un nombre para que cada palabra comience con una letra mayúscula.
 * @param {string} str - El nombre a formatear.
 * @return {string} - El nombre formateado.
 */
export const formatName = (str: string): string => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
