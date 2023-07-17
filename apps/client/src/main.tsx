import React from 'react'
import ReactDOM from 'react-dom/client'

import { App } from './app.tsx'
import { Toaster } from './shared/components/ui/toaster.tsx'
import './globals.css'

if (!CSS.supports('text-wrap', 'balance')) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { default: balanceText } = await import('balance-text')
  balanceText()
}

ReactDOM.createRoot(document.querySelector('#root') as HTMLElement).render(
  <React.StrictMode>
    <App />
    <Toaster/>
  </React.StrictMode>,
)
