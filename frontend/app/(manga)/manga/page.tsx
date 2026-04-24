'use client';

import ProtectedPage from '@/components/ProtectedPage';
import { useUser } from '@/components/UserProvider'
import { Manga, Tag } from '@/types';
import { AppBar, Backdrop, Box, CircularProgress, Toolbar, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getClientMangaFromMangaDexManga } from '@/utils/mangaDex';
import { useToast } from '@/components/ToastProvider';
import MangaGrid from '@/components/MangaGrid';
import SearchBar from '@/components/SearchBar';

const page = () => {
    const { user } = useUser();
    const { showError, showSuccess } = useToast();

    const [mangaList, setMangaList] = useState<Manga[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);

    // Loading States
    const [mangaLoading, setMangaLoading] = useState(true);
    const [tagsLoading, setTagsLoading] = useState(true);

    // Filter States
    const [debouncedSearchText, setDebouncedSearchText] = useState("");
    // This is an array of MangaDex tag ids
    const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
    const [releaseYear, setReleaseYear] = useState<null | number>(null)

    // Pagination States
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [page, setPage] = useState(1);

    useEffect(() => {

    }, [])

    // Load the manga from the backend
    useEffect(() => {
        const loadData = async () => {
            try {
                await loadManga();
            } catch(error) {
                if(error instanceof Error && 'message' in error) {
                    showError(error.message);
                } else {
                    showError("Failed to load manga");
                }
            } finally {
                // We don't set the loading state to true at the start of the effect because we want the loading wheel to show only on the inital load
                setMangaLoading(false);
            }
        }

        loadData();
    }, [debouncedSearchText, filteredTags, page, rowsPerPage, releaseYear])

    // Load the tags from MangaDex
    useEffect(() => {
        const loadData = async () => {
            try {
                await loadTags();
            } catch(error) {
                showError("Failed to load resources");
            } finally {
                setTagsLoading(false);
            }
            
        }
        loadData();
    }, [])

    const loadTags = async () => {
        const response = await fetch("https://api.mangadex.org/manga/tag")

        if(!response.ok) {
            throw new Error("Failed to fetch tags")
        }

        const data = (await response.json()).data

        const tags: Tag[] = data.map((tag: any) => {
            return {
                id: tag.id,
                name: tag.attributes.name.en || "No Name"
            }
        })

        setTags(tags)

        // TODO: Remove after development
        console.log("Tags", tags);
    }

    const loadManga = async () => {
        const searchParams = new URLSearchParams();

        // Add pagination params
        searchParams.append("page", String(page));
        searchParams.append("limit", String(rowsPerPage));

        // Add filter params
        if(debouncedSearchText.trim()) {
            searchParams.append("searchText", debouncedSearchText.trim());
        }
        
        if(releaseYear) {
            searchParams.append("releaseYear", String(releaseYear));
        }
        
        filteredTags.forEach((tag) => {
            searchParams.append("tags", tag.id);
        });

        // Query for list of manga
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/manga/?${searchParams.toString()}`, {
            method: "GET",
            credentials: "include"
        });

        if(!response.ok) {
            throw new Error("Failed to load manga")
        }

        const mangaDexMangaList = (await response.json()).data;

        // Transform returned manga objects into client manga types
        const clientMangaList = await getClientMangaFromMangaDexManga(mangaDexMangaList);

        // Set the mangaList state
        setMangaList(clientMangaList);

        // TODO: Remove this after finishing developing this page
        console.log("MangaList", clientMangaList)
        console.log("Raw Manga", mangaDexMangaList)
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100vw",
                backgroundColor: "var(--bg-dark)"
            }}
        >
            <Toolbar sx={{
                width: "100%"
            }}/>
            <Box
                sx={{
                    minHeight: "90vh",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    px: "20px"
                }}
            >
                <ProtectedPage isContentLoading={tagsLoading || mangaLoading}>
                    <Typography sx={{ fontSize: "2.5rem", mt: "20px", fontWeight: 600}}>Discover New Manga</Typography>
                    <SearchBar 
                        debouncedSearchText={debouncedSearchText} 
                        setDebouncedSearchText={setDebouncedSearchText}
                        filteredTags={filteredTags}
                        setFilteredTags={setFilteredTags}
                        releaseYear={releaseYear}
                        setReleaseYear={setReleaseYear} 
                        page={page}
                        setPage={setPage}
                        rowsPerPage={rowsPerPage}
                        setRowsPerPage={setRowsPerPage}
                        tags={tags}
                    />
                    <MangaGrid mangaList={mangaList}/>
                </ProtectedPage>
                
            </Box>
        </Box>
    )
}

export default page
