import { useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import TaskList from './components/TaskList'
import { ThemeProvider } from './contexts/ThemeContext'
import { ThemeContext } from './contexts/themeContextValue'
import { initialState, tasksReducer } from './hooks/useTasksReducer'
import { useLocalStorage } from './hooks/useLocalStorage'
import './App.css'

function Dashboard() {
  const { theme, toggleTheme } = useContext(ThemeContext)
  const [savedTasks, setSavedTasks] = useLocalStorage('dashboard-tasks', [])
  const [state, dispatch] = useReducer(tasksReducer, savedTasks, (items) => ({ ...initialState, items }))
  const [title, setTitle] = useState('')
  const [query, setQuery] = useState('')
  useEffect(() => { setSavedTasks(state.items) }, [setSavedTasks, state.items])
  const stats = useMemo(() => ({ total: state.items.length, pending: state.items.filter((task) => !task.completed).length, completed: state.items.filter((task) => task.completed).length }), [state.items])
  const addTask = (event) => { event.preventDefault(); const cleanTitle = title.trim(); if (!cleanTitle) return; dispatch({ type: 'ADD', payload: { id: crypto.randomUUID(), title: cleanTitle, completed: false, createdAt: new Date().toISOString() } }); setTitle('') }
  const toggleTask = useCallback((id) => dispatch({ type: 'TOGGLE', payload: id }), [])
  const removeTask = useCallback((id) => dispatch({ type: 'REMOVE', payload: id }), [])
  return <main className="dashboard-shell"><aside className="sidebar"><div className="brand"><span>✓</span><strong>TaskFlow</strong></div><nav aria-label="Navegación principal"><a className="active" href="#inicio">▦ <span>Resumen</span></a><a href="#tareas">☑ <span>Mis tareas</span></a></nav><div className="sidebar-tip">Organiza tu día,<br />una tarea a la vez.</div></aside><div className="content" id="inicio"><header className="topbar"><div><p className="eyebrow">PANEL PERSONAL</p><h1>Hola, organiza tu día</h1><p className="subtitle">Mantén el enfoque en lo que realmente importa.</p></div><button className="theme-button" onClick={toggleTheme} type="button" aria-label="Cambiar tema">{theme === 'light' ? '☾' : '☀'} <span>{theme === 'light' ? 'Oscuro' : 'Claro'}</span></button></header><section className="stats" aria-label="Estadísticas"><Stat icon="▣" label="Total" value={stats.total} /><Stat icon="◷" label="Pendientes" value={stats.pending} /><Stat icon="✓" label="Completadas" value={stats.completed} /></section><section className="add-card"><div><p className="eyebrow">NUEVA TAREA</p><h2>¿Qué necesitas hacer?</h2></div><form onSubmit={addTask}><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Escribe una tarea..." maxLength="120" aria-label="Nueva tarea" /><button type="submit">+ Agregar</button></form></section><section className="controls" id="tareas"><div className="filters" aria-label="Filtrar tareas">{[['all', 'Todas'], ['pending', 'Pendientes'], ['done', 'Completadas']].map(([value, label]) => <button className={state.filter === value ? 'selected' : ''} onClick={() => dispatch({ type: 'FILTER', payload: value })} type="button" key={value}>{label}</button>)}</div><label className="search">⌕<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar tarea" /></label><select value={state.sort} onChange={(event) => dispatch({ type: 'SORT', payload: event.target.value })} aria-label="Ordenar tareas"><option value="asc">A → Z</option><option value="desc">Z → A</option></select></section><TaskList tasks={state.items} filter={state.filter} sort={state.sort} query={query} onToggle={toggleTask} onRemove={removeTask} /></div></main>
}
function Stat({ icon, label, value }) { return <article className="stat-card"><span className="stat-icon">{icon}</span><div><span>{label}</span><strong>{value}</strong></div></article> }
export default function App() { return <ThemeProvider><Dashboard /></ThemeProvider> }
