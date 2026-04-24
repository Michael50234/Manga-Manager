'use client';
import { Stack, Typography } from '@mui/material';
import React from 'react'

const PaginationControls = () => {
  return (
    <Stack direction="row">
        <Stack direction="row">
            <Typography>Rows Per Page: </Typography>
            
        </Stack>
        <Stack direction="row"></Stack>
    </Stack>
  )
}

export default PaginationControls
