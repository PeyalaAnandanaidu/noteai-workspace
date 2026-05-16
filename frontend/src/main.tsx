import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AppRouter } from './routes'
import { Toaster } from './components/ui/toaster'
import './index.css'

// ✅ Initialize theme before render to prevent flash
const savedTheme = localStorage.getItem('theme-storage')
if (savedTheme) {
  try {
    const parsed = JSON.parse(savedTheme)
    if (parsed?.state?.isDark) {
      document.documentElement.classList.add('dark')
    }
  } catch {
    // ignore parse errors
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
)