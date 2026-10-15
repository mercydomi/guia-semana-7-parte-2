import { useEffect, useState } from 'react'
import { ThemeContext } from './themeContextValue'

export { ThemeContext } from './themeContextValue'

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try { return window.localStorage.getItem('dashboard-theme') || 'light' } catch { return 'light' }
  })
  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.style.colorScheme = theme
    try { window.localStorage.setItem('dashboard-theme', theme) } catch (error) { console.warn('No se pudo guardar la preferencia de tema.', error) }
    return () => { root.removeAttribute('data-theme'); root.style.removeProperty('color-scheme') }
  }, [theme])
  const toggleTheme = () => setTheme((current) => current === 'light' ? 'dark' : 'light')
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}
