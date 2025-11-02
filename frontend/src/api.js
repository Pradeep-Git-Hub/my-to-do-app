const API_ROOT = '/api'

export async function listTasks() {
  const res = await fetch(`${API_ROOT}/GetTasks`)
  if (!res.ok) return []
  return await res.json()
}

export async function createTask(payload) {
  const res = await fetch(`${API_ROOT}/CreateTask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  return res.ok ? res.json() : null
}

export async function updateTask(id, payload) {
  const res = await fetch(`${API_ROOT}/UpdateTask/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    // try to extract error message
    let err = null
    try { err = await res.json() } catch(e) { err = { status: res.status } }
    throw new Error(err && err.error ? err.error : `Update failed (${res.status})`)
  }
  // return updated resource when available
  try { return await res.json() } catch (e) { return null }
}

export async function deleteTask(id) {
  const res = await fetch(`${API_ROOT}/DeleteTask/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  })
  return res.ok
}
