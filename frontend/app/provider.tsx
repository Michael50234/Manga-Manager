'use client'
import theme from '@/theme'


import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import React from 'react'

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
        <AppRouterCacheProvider>
            {children}
        </AppRouterCacheProvider>
    </ThemeProvider>
  )
}

export default Provider
