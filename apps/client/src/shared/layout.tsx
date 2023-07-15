import type React from 'react'

export function Layout({ children }: { children: React.ReactNode }) {
  return <div className='flex flex-col min-h-[100dvh]'>
    <div className="container mx-auto my-16 2xl:my-32 flex-1 flex flex-col">
      {children}
    </div>
  </div>
}
