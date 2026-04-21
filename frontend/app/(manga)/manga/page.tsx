import { Box, Typography } from '@mui/material'
import React from 'react'

const page = () => {
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
            <Typography>Hello</Typography>
        </Box>
    </Box>
  )
}

export default page
