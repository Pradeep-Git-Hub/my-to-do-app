import React, { useEffect, useState } from 'react'
import { listTasks, createTask, updateTask, deleteTask } from './api'
import { motion, AnimatePresence } from 'framer-motion'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')

  useEffect(() => { fetchTasks() }, [])

  async function fetchTasks() {
    setLoading(true)
    try {
      const data = await listTasks()
      setTasks(data || [])
    } catch (err) {
      console.error('Failed to load tasks', err)
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  async function onAdd(e) {
    e.preventDefault()
    if (!title.trim()) return
    try {
      await createTask({ title: title.trim() })
      setTitle('')
      fetchTasks()
    } catch (err) {
      console.error('Create failed', err)
      alert('Could not create task: ' + err.message)
    }
  }

  async function onToggle(task) {
    // optimistic update
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t))
    try {
      await updateTask(task.id, { completed: !task.completed })
      // refresh to normalize server fields
      fetchTasks()
    } catch (err) {
      // revert optimistic change
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: task.completed } : t))
      console.error('Update failed', err)
      alert('Could not update task: ' + err.message)
    }
  }

  function startEdit(task) {
    setEditingId(task.id)
    setEditingTitle(task.title || '')
  }

  function cancelEdit() {
    setEditingId(null)
    setEditingTitle('')
  }

  async function saveEdit(task) {
    const newTitle = (editingTitle || '').trim()
    if (!newTitle) {
      alert('Title cannot be empty')
      return
    }
    // optimistic update
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, title: newTitle } : t))
    setEditingId(null)
    setEditingTitle('')
    try {
      await updateTask(task.id, { title: newTitle })
      fetchTasks()
    } catch (err) {
      console.error('Update failed', err)
      alert('Could not update task: ' + err.message)
      fetchTasks()
    }
  }

  async function onDelete(id) {
    try {
      await deleteTask(id)
      fetchTasks()
    } catch (err) {
      console.error('Delete failed', err)
      alert('Could not delete task: ' + err.message)
    }
  }

  return (
    <div className="app">
      <div className="card">
        <h1>Azure Serverless To-Do</h1>
        <form onSubmit={onAdd} className="controls">
          <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Add a task — e.g. Buy groceries" />
          <button className="btn" type="submit">Add</button>
        </form>

        {loading ? (
          <div className="empty">Loading…</div>
        ) : (
          <ul className="tasks">
            <AnimatePresence initial={false}>
              {tasks.length === 0 && <div className="empty">No tasks yet — add one above</div>}
              {tasks.map(t => (
                <motion.li
                  layout
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.16 }}
                  key={t.id}
                  className="task-item"
                >
                  <input className="checkbox" type="checkbox" checked={!!t.completed} onChange={() => onToggle(t)} />
                  <div className="task-title">
                    {editingId === t.id ? (
                      <div>
                        <input value={editingTitle} onChange={e => setEditingTitle(e.target.value)} className="input" />
                        <div className="task-meta small muted">{new Date(t.createdAt).toLocaleString()}</div>
                      </div>
                    ) : (
                      <div>
                        <div className={t.completed ? 'strike' : ''}>{t.title}</div>
                        <div className="task-meta small muted">{new Date(t.createdAt).toLocaleString()}</div>
                      </div>
                    )}
                  </div>
                  <div className="task-actions">
                    {editingId === t.id ? (
                      <>
                        <button className="btn" onClick={() => saveEdit(t)}>Save</button>
                        <button className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-secondary" onClick={() => startEdit(t)}>Edit</button>
                        <button className="btn btn-secondary" onClick={() => onDelete(t.id)}>Delete</button>
                      </>
                    )}
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  )
}
