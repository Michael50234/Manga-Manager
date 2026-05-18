'use client';

import ProtectedPage from '@/components/ProtectedPage';
import { useUser } from '@/components/UserProvider'
import { FavouriteMangaObject, Manga, Tag, UserMangaPreference } from '@/types';
import { AppBar, Backdrop, Box, CircularProgress, Stack, Toolbar, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { getClientMangaFromMangaDexManga } from '@/utils/mangaDex';
import { useToast } from '@/components/ToastProvider';
import MangaGrid from '@/components/MangaGrid';
import SearchBar from '@/components/SearchBar';
import PaginationControls from '@/components/PaginationControls';

const Dashboard = () => {
    const { user } = useUser();
    const { showError, showSuccess } = useToast();

    const [mangaList, setMangaList] = useState<Manga[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [totalFilteredManga, setTotalFilteredManga] = useState(0);

    // Loading States
    const [mangaLoading, setMangaLoading] = useState(true);
    const [tagsLoading, setTagsLoading] = useState(true);

    // Filter States
    const [debouncedSearchText, setDebouncedSearchText] = useState("");
    // This is an array of MangaDex tag ids
    const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
    const [releaseYear, setReleaseYear] = useState<null | number>(null)

    // Pagination States
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [page, setPage] = useState(1);

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
    }, [debouncedSearchText, filteredTags, page, entriesPerPage, releaseYear]);

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
    }, []);

    // When any of the query parameters or entriesPerPage changes reset the page to 1
    useEffect(() => {
        setPage(1);
    }, [debouncedSearchText, filteredTags, releaseYear, entriesPerPage])

    const totalPages = useMemo(() => {
        
        const totalPages = Math.ceil(totalFilteredManga / entriesPerPage);
        
        // MangaDex has the constraint that (offset + limit) <= 10000, so we must limit the max page to 10000 / entriesPerPage 
        if(totalPages > Math.ceil(10000 / entriesPerPage)) {
            return Math.ceil(10000 / entriesPerPage);
        }

        return totalPages;
    }, [totalFilteredManga, entriesPerPage]);

    const loadTags = async () => {
        // Get list of all tags from MangaDex
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/manga/tag-list`, {
            credentials: "include"
        })

        if(!response.ok) {
            throw new Error("Failed to fetch tags")
        }

        const data = (await response.json()).data;

        // Convert the MangaDex tag objects into the client Tag type
        const tags: Tag[] = data.map((tag: any) => {
            return {
                id: tag.id,
                name: tag.attributes.name.en || "No Name"
            }
        });

        // Set the value of the tags state
        setTags(tags);

        // TODO: Remove after development
        console.log("Tags", tags);
    }

    const loadManga = async () => {
        const searchParams = new URLSearchParams();

        // Add pagination params
        searchParams.append("page", String(page));
        searchParams.append("limit", String(entriesPerPage));

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

        // Query for the list of manga
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/manga/?${searchParams.toString()}`, {
            method: "GET",
            credentials: "include"
        });

        if(!response.ok) {
            throw new Error("Failed to load manga")
        }

        const data = await response.json();
        const mangaDexMangaList = data.data;

        // Transform returned manga objects into client manga types
        const clientMangaList = await getClientMangaFromMangaDexManga(mangaDexMangaList);

        // Set the mangaList totalFilteredManga states
        setMangaList(clientMangaList);
        setTotalFilteredManga(data.total);

        // TODO: Remove this after finishing developing this page
        console.log(clientMangaList)
        console.log("data", mangaDexMangaList)
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100%",
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
                    <Stack 
                        spacing={5}
                        sx={{
                            mt: "20px",
                            width: "100%",
                            alignItems: "center",
                        }}
                    >
                        <Typography sx={{ fontSize: "3rem", mt: "40px", fontWeight: 600}}>Discover New Manga</Typography>
                        <SearchBar 
                            debouncedSearchText={debouncedSearchText} 
                            setDebouncedSearchText={setDebouncedSearchText}
                            filteredTags={filteredTags}
                            setFilteredTags={setFilteredTags}
                            releaseYear={releaseYear}
                            setReleaseYear={setReleaseYear} 
                            tags={tags}
                        />
                        <Stack 
                            spacing={4}
                            sx={{
                                alignItems: "center",
                                width: "100%"
                            }}
                        >
                            { totalFilteredManga > 0 ? 
                                (
                                    <>
                                        <PaginationControls 
                                            entriesPerPage={entriesPerPage}
                                            setEntriesPerPage={setEntriesPerPage}
                                            page={page}
                                            setPage={setPage}
                                            totalPages={totalPages}
                                        />
                                        <MangaGrid mangaList={mangaList} />
                                        <PaginationControls 
                                            entriesPerPage={entriesPerPage}
                                            setEntriesPerPage={setEntriesPerPage}
                                            page={page}
                                            setPage={setPage}
                                            totalPages={totalPages}
                                        />
                                    </>
                                ) : (
                                    <Box sx={{
                                        py: "200px",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}>
                                        <Typography sx={{
                                            fontSize: "3rem",
                                            fontWeight: 600,
                                        }}>
                                            No Manga Found
                                        </Typography>
                                        <Typography sx={{
                                            color: "var(--text-muted)"
                                        }}>You Searched For {debouncedSearchText}</Typography>
                                    </Box>
                                )
                            }
                        </Stack>
                    </Stack>
                </ProtectedPage>
            </Box>
        </Box>
    )
}

export default Dashboard
