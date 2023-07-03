import React from 'react'
import ReactDOM from 'react-dom/client'

import { App } from './app.tsx'
import { Toaster } from './components/ui/toaster.tsx'
import './globals.css'

ReactDOM.createRoot(document.querySelector('#root') as HTMLElement).render(
  <React.StrictMode>
    <App />
    <Toaster/>
  </React.StrictMode>,
)
