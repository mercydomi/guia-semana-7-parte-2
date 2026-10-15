import { memo, useCallback, useEffect, useMemo, useRef } from 'react'

function TaskList({ tasks, filter, sort, query, onToggle, onRemove }) {
  const inputRef = useRef(null)
  useEffect(() => {
    inputRef.current?.focus()
    const focusTaskInput = (event) => { if (event.key === 'Escape') inputRef.current?.focus() }
    window.addEventListener('keydown', focusTaskInput)
    return () => window.removeEventListener('keydown', focusTaskInput)
  }, [])
  const visibleTasks = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    return tasks.filter((task) => filter === 'all' || (filter === 'done' ? task.completed : !task.completed))
      .filter((task) => task.title.toLocaleLowerCase().includes(normalizedQuery))
      .sort((first, second) => (sort === 'asc' ? 1 : -1) * first.title.localeCompare(second.title, 'es'))
  }, [filter, query, sort, tasks])
  const handleToggle = useCallback((id) => onToggle(id), [onToggle])
  const handleRemove = useCallback((id) => onRemove(id), [onRemove])
  return <section className="task-panel" aria-labelledby="tasks-title"><div className="panel-title-row"><div><p className="eyebrow">LISTADO</p><h2 id="tasks-title">Tus tareas</h2></div><span className="task-count">{visibleTasks.length} visibles</span></div><input ref={inputRef} className="sr-only" aria-label="Atajo para agregar tarea" tabIndex="-1" />{visibleTasks.length === 0 ? <div className="empty-state"><span>✓</span><p>No hay tareas que coincidan con esta vista.</p></div> : <ul className="task-list">{visibleTasks.map((task) => <li className={`task ${task.completed ? 'completed' : ''}`} key={task.id}><button className="check-button" type="button" aria-label={`Marcar ${task.title} como ${task.completed ? 'pendiente' : 'completada'}`} onClick={() => handleToggle(task.id)}>{task.completed && '✓'}</button><span className="task-name">{task.title}</span><time dateTime={task.createdAt}>{new Date(task.createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}</time><button className="remove-button" type="button" aria-label={`Eliminar ${task.title}`} onClick={() => handleRemove(task.id)}>×</button></li>)}</ul>}</section>
}
export default memo(TaskList)
