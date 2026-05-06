'use client';

import MangaGrid from '@/components/MangaGrid';
import PaginationControls from '@/components/PaginationControls';
import ProtectedPage from '@/components/ProtectedPage';
import { useToast } from '@/components/ToastProvider';
import { FavouriteMangaObject, Manga } from '@/types';
import { getClientMangaFromMangaDexManga } from '@/utils/mangaDex';
import { Box, Stack, Toolbar, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'

const FavouriteMangaPage = () => {
  const { showError } = useToast();

  const [mangaLoading, setMangaLoading] = useState(true);

  const [mangaList, setMangaList] = useState<Manga[]>([])
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [totalFavouritedManga, setTotalFavouriteManga] = useState(0)

  const totalPages = useMemo(() => {
    return Math.ceil(totalFavouritedManga / entriesPerPage);
  }, [entriesPerPage, totalFavouritedManga]);

  useEffect(() => {
    const loadData = async () => {
      try {
        await loadFavouriteManga();
      } catch(error) {
        showError("Failed to load manga");
      } finally {
        setMangaLoading(false);
      }
    }

    loadData();
  }, [entriesPerPage, page])

  const loadFavouriteManga = async () => {
    // Get the MangaDex ids of the user's favourite manga's
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/manga/favourites?page=${page}&limit=${entriesPerPage}`, {
      method: "GET",
      credentials: "include"
    });

    if(!response.ok) {
      throw new Error("Failed to fetch favourite mangas");
    }

    const data: { data: FavouriteMangaObject[], count: number } = await response.json();
    
    // Add default search params
    const searchParams = new URLSearchParams([
        ["includes[]", "author"], 
        ["includes[]", "tag"],
        ["includes[]", "cover_art"]
    ])

    // Add the ids of the favourited manga to the search params
    data.data.forEach((favouriteMangaObject) => {
      searchParams.append("ids[]", favouriteMangaObject.mangaDexId)
    });

    // Add the limit pagination param
    searchParams.append("limit", String(data.data.length));

    const response2 = await fetch(`https://api.mangadex.org/manga?${searchParams.toString()}`);

    if(!response2.ok) {
      throw new Error("Failed to fetch favourite mangas");
    }

    const mangaDexData = await response2.json();

    // Covert the MangaDex manga into the client manga type
    const clientManga = await getClientMangaFromMangaDexManga(mangaDexData.data);

    // Set client states
    setTotalFavouriteManga(data.count)
    setMangaList(clientManga);
  }

  return (
    <Box sx={{
      minHeight: "100vh",
      width: "100%",
      backgroundColor: "var(--bg-dark)"
    }}>
      {/* Add a toolbar here to push everything down and make space for the navbar */}
      <Toolbar />
      <ProtectedPage isContentLoading={mangaLoading}>
        <Stack
          spacing={4}
          alignItems="center"
          sx={{
            height: "90%",
            width: "100vw",
          }}
        >
          <Typography 
            sx={{
              fontSize: "3rem",
              fontWeight: 600,
              pt: "20px"
            }}
          >
            Favourite Manga
          </Typography>
          <PaginationControls totalPages={totalPages} entriesPerPage={entriesPerPage} setEntriesPerPage={setEntriesPerPage} page={page} setPage={setPage}/>
          <MangaGrid mangaList={mangaList}/>
        </Stack>
      </ProtectedPage>
    </Box>
  )
}

export default FavouriteMangaPage;
