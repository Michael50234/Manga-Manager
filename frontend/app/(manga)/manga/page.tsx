'use client';

import ProtectedPage from '@/components/ProtectedPage';
import { useUser } from '@/components/UserProvider'
import { Box, Typography } from '@mui/material'
import React from 'react'

const page = () => {
    const { user } = useUser();

  return (
    <Box
        sx={{
            minHeight: "100vh",
            width: "100vw",
            backgroundColor: "var(--bg-dark)"
        }}
    >
        <Box
            sx={{
                minHeight: "100vh",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: "20px"
            }}
        >
            <ProtectedPage>
                <Typography>{user?.email  ?? "Hello"}</Typography>
            </ProtectedPage>
            
        </Box>
    </Box>
  )
}

export default page
