import React from 'react'
import { createRoot } from 'react-dom/client'
// App was duplicated in the workspace; import the cleaned App2 implementation
import App from './App'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
