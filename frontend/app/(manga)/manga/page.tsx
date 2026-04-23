'use client';

import ProtectedPage from '@/components/ProtectedPage';
import { useUser } from '@/components/UserProvider'
import { Manga, Tag } from '@/types';
import { Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getClientMangaFromMangaDexManga } from '@/utils/mangaDex';

const page = () => {
    const { user } = useUser();

    // Loading States
    const [userLoading, setUserLoading] = useState(true);
    const [tagsLoading, setTagsLoading] = useState(true);

    // Filter States
    const [searchText, setSearchText] = useState("");
    // This is an array of MangaDex tag ids
    const [filteredTags, setFilteredTags] = useState<string[]>([]);
    const [releaseYear, setReleaseYear] = useState<null | number>(null)

    // Pagination States
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const loadData = async () => {
            await loadManga();
        }

        loadData();
    }, [searchText, filteredTags, page, rowsPerPage])

    const loadManga = async () => {
        const searchParams = new URLSearchParams();

        // Add pagination params
        searchParams.append("page", String(page));
        searchParams.append("limit", String(rowsPerPage));

        // Add filter params
        if(searchText.trim()) {
            searchParams.append("searchText", searchText);
        }
        
        if(releaseYear) {
            searchParams.append("releaseYear", String(releaseYear));
        }
        
        filteredTags.forEach((tag) => {
            searchParams.append("tag[]", tag);
        })

        // Query for list of manga
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/manga/?${searchParams.toString()}`, {
            method: "GET",
            credentials: "include"
        })

        const data = (await response.json()).data;
        console.log(data)
        const clientMangaList = await getClientMangaFromMangaDexManga(data);
        console.log(clientMangaList)
    }

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
