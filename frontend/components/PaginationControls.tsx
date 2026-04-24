'use client';
import { IconButton, MenuItem, Pagination, Select, Stack, Typography } from '@mui/material';
import React from 'react'

type PaginationControlsProp = {
    entriesPerPage: number,
    setEntriesPerPage: React.Dispatch<React.SetStateAction<number>>,
    page: number,
    setPage: React.Dispatch<React.SetStateAction<number>>,
    totalPages: number
}

const PaginationControls = ({entriesPerPage, setEntriesPerPage, page, setPage, totalPages}: PaginationControlsProp) => {
    const entriesPerPageOptions = [10, 20, 50, 100];

    return (
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Stack direction="row" spacing={1}>
                <Typography>Rows Per Page: </Typography>
                <Select 
                    value={entriesPerPage}
                    onChange={(e) => setEntriesPerPage(e.target.value)}
                    sx={{
                        height: "30px"
                    }}
                >
                    {entriesPerPageOptions.map((option) => {
                        return <MenuItem value={option}>{option}</MenuItem>
                    })}
                </Select>
            </Stack>
            <Stack direction="row">
                <Pagination page={page} count={totalPages} siblingCount={0} boundaryCount={3} onChange={(e, value) => setPage(value)}/>
            </Stack>
        </Stack>
    )
}

export default PaginationControls