'use client';

import { Tag } from '@/types';
import { Clear, Search } from '@mui/icons-material';
import { Autocomplete, Box, Button, IconButton, InputAdornment, Popover, Stack, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'

type SearchBarProps = {
    debouncedSearchText: string, 
    setDebouncedSearchText: React.Dispatch<React.SetStateAction<string>>, 
    filteredTags: Tag[], 
    setFilteredTags: React.Dispatch<React.SetStateAction<Tag[]>>, 
    releaseYear: number | null, 
    setReleaseYear: React.Dispatch<React.SetStateAction<number | null>>, 
    tags: Tag[],
}

const SearchBar = ({ 
        debouncedSearchText, 
        setDebouncedSearchText, 
        filteredTags, 
        setFilteredTags, 
        releaseYear, 
        setReleaseYear, 
        tags
    }: SearchBarProps) => {

    const [searchText, setSearchText] = useState("");
    const [anchorElTagFilter, setAnchorElTagFilter] = useState<Element | null>(null);

    useEffect(() => {
        console.log("search", debouncedSearchText)
        const searchTimeout = setTimeout(() => {
            setDebouncedSearchText(searchText);
        }, 600)

        // The cleanup function clears the timeout, such that the timeout will reset everytime the effect runs
        return () => clearTimeout(searchTimeout);
    }, [searchText])

    // Generate yearsList for year dropdown
    let yearsList: Array<number> = []
    for(let year = 1970; year <= (new Date()).getFullYear(); year++) {
        yearsList.push(year);
    }
    yearsList.reverse();

    return (
        <Box sx={{
            width: "680px",
            my: "30px",
            height: "70px",
            backgroundColor: "var(--bg)",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px",
            border: "1px solid var(--border-dark)",
        }}>
            <Stack direction="row" spacing={2}>
                <Autocomplete 
                    value={releaseYear}
                    onChange={(e, value) => {
                        setReleaseYear(value)
                    }}
                    options={yearsList}
                    renderInput={(params) => {
                        return <TextField {...params} placeholder={"Release Year"} sx={{
                            "& .MuiInputBase-root": {
                                height: "50px",
                            },
                        }}/>
                    }}
                    getOptionLabel={(option) => {
                        return String(option);
                    }}
                    sx={{
                        width: "180px",
                    }}
                />
                <TextField 
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder='Search'
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    {searchText.length > 0 && 
                                        (<IconButton onClick={() => setSearchText("")}>
                                            <Clear />
                                        </IconButton>)
                                    }
                                </InputAdornment>
                            )
                        }
                    }}
                    sx={{
                        width: "300px",
                        "& .MuiInputBase-root": {
                            height: "50px",
                        },
                        "& .MuiInputBase-input": {
                            height: "100%",
                            boxSizing: "border-box",
                        },
                    }}
                />
                <Button 
                    variant="contained"
                    onClick={(e) => setAnchorElTagFilter(e.currentTarget)}
                    sx={{
                        height: "50px",
                        color: "black",
                        backgroundColor: "var(--bg-light)"
                    }}
                >
                    Filter By Tags
                </Button>
                <Popover
                    onClose={() => setAnchorElTagFilter(null)}
                    anchorEl={anchorElTagFilter}
                    open={!!anchorElTagFilter}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left"
                    }}
                >
                    <Autocomplete 
                        value={filteredTags}
                        onChange={(e, value) => {
                            setFilteredTags(value)
                        }}
                        multiple={true}
                        sx={{
                            width: "350px"
                        }}
                        options={tags}
                        getOptionLabel={(option) => {
                            return option.name;
                        }}
                        renderInput={(params) => {
                            return <TextField placeholder="Select Tags" {...params}/>
                        }}
                    />
                </Popover>
            </Stack>
        </Box>
    )
}

export default SearchBar
