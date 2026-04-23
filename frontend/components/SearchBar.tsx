import { Tag } from '@/types';
import { Autocomplete, Box, TextField } from '@mui/material'
import React, { useState } from 'react'

type SearchBarProps = {
    searchText: string, 
    setSearchText: React.Dispatch<React.SetStateAction<string>>, 
    filteredTags: Tag[], 
    setFilteredTags: React.Dispatch<React.SetStateAction<Tag[]>>, 
    releaseYear: number | null, 
    setReleaseYear: React.Dispatch<React.SetStateAction<number | null>>, 
    page: number, 
    setPage: React.Dispatch<React.SetStateAction<number>>, 
    rowsPerPage: number, 
    setRowsPerPage: React.Dispatch<React.SetStateAction<number>>, 
    tags: Tag[],
}

const SearchBar = ({ 
        searchText, 
        setSearchText, 
        filteredTags, 
        setFilteredTags, 
        releaseYear, 
        setReleaseYear, 
        page, 
        setPage, 
        rowsPerPage, 
        setRowsPerPage, 
        tags
    }: SearchBarProps) => {
    
    const [debouncedSearchText, setDecouncedSearchText] = useState("");

    return (
        <Box sx={{
            width: "800px",
            my: "30px",
            height: "60px",
            backgroundColor: "var(--bg-light)",
            borderRadius: "10px"
        }}>
            <TextField />
        </Box>
    )
}

export default SearchBar
