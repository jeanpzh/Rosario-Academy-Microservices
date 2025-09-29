'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, useTheme } from 'next-themes'
import { Toaster } from 'sonner'
import React, { useState } from 'react'
import { Provider as BalancerProvider } from 'react-wrap-balancer'

function ToasterWrapper() {
  const { theme } = useTheme()
  return (
    <Toaster
      toastOptions={{
        style: {
          borderRadius: '0.5rem',
          fontSize: '0.875rem'
        },
        actionButtonStyle: {
          backgroundColor: 'var(--primary)',
          color: 'white',
          fontWeight: 500
        },
        cancelButtonStyle: {
          backgroundColor: 'transparent',
          color: 'var(--muted-foreground)',
          fontWeight: 500
        },
        // Add styling for the alternative action button
        // Add custom duration for notifications with actions
        duration: 5000
      }}
      // Enable rich colors for better visual hierarchy
      richColors
      expand={true}
      theme={theme === 'dark' ? 'dark' : 'light'}
    />
  )
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000
          }
        }
      })
  )

  return (
    <QueryClientProvider client={client}>
      <BalancerProvider>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <ToasterWrapper />
          {children}
        </ThemeProvider>
      </BalancerProvider>
    </QueryClientProvider>
  )
}
