import { useEffect, useState } from 'react'

export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const savedValue = window.localStorage.getItem(key)
      return savedValue === null ? defaultValue : JSON.parse(savedValue)
    } catch (error) {
      console.warn(`No se pudo leer "${key}" desde localStorage.`, error)
      return defaultValue
    }
  })
  useEffect(() => {
    try { window.localStorage.setItem(key, JSON.stringify(value)) }
    catch (error) { console.warn(`No se pudo guardar "${key}" en localStorage.`, error) }
  }, [key, value])
  return [value, setValue]
}
