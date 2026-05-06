'use client';

import MangaGrid from '@/components/MangaGrid';
import PaginationControls from '@/components/PaginationControls';
import ProtectedPage from '@/components/ProtectedPage';
import { useToast } from '@/components/ToastProvider';
import { DaysOfWeek, FavouriteMangaObject, GetUserMangaPreferencesResponse, Manga, TierListRank } from '@/types';
import { getClientMangaFromMangaDexManga } from '@/utils/mangaDex';
import { Box, FormControl, FormLabel, InputLabel, MenuItem, Select, Stack, Toolbar, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'

const FollowedMangaPage = () => {
  const { showError } = useToast();

  const [mangaLoading, setMangaLoading] = useState(true);

  const [releaseDay, setReleaseDay] = useState<DaysOfWeek | "">("");
  const [tierListRank, setTierListRank] = useState<TierListRank | "">("")

  const [mangaList, setMangaList] = useState<Manga[]>([])
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [totalFollowedManga, setTotalFollowedManga] = useState(0);

  const totalPages = useMemo(() => {
    return Math.ceil(totalFollowedManga / entriesPerPage);
  }, [entriesPerPage, totalFollowedManga]);

  useEffect(() => {
    const loadData = async () => {
      try {
        await loadFollowedManga();
      } catch(error) {
        showError("Failed to load manga");
      } finally {
        setMangaLoading(false);
      }
    }

    loadData();
  }, [entriesPerPage, page, releaseDay, tierListRank])

  const loadFollowedManga = async () => {
    // Get the MangaDex ids of the user's favourite manga's
    const backendSearchParams = new URLSearchParams([
      ['page', `${page}`],
      ['limit', `${entriesPerPage}`]
    ])

    if(releaseDay) {
      console.log("working")
      backendSearchParams.append('mangaReleaseDay', `${releaseDay}`)
    }

    if(tierListRank) {
      backendSearchParams.append('tierListRank', `${tierListRank}`)
    }

    console.log(`${process.env.NEXT_PUBLIC_API_BASE_URL}/manga/user-manga-preferences?${backendSearchParams.toString()}`)

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/manga/user-manga-preferences?${backendSearchParams.toString()}`, {
      method: "GET",
      credentials: "include"
    });

    if(!response.ok) {
      throw new Error("Failed to fetch favourite mangas");
    }

    const data: GetUserMangaPreferencesResponse = await response.json();
    
    // Add default search params
    const mangaDexSearchParams = new URLSearchParams([
        ["includes[]", "author"], 
        ["includes[]", "tag"],
        ["includes[]", "cover_art"]
    ])

    // Add the ids of the followed manga to the search params
    data.data.forEach((mangaPreference) => {
      if(mangaPreference.manga !== undefined) {
        mangaDexSearchParams.append("ids[]", mangaPreference.manga.mangaDexId);
      }
    });

    // Add the limit pagination param
    mangaDexSearchParams.append("limit", String(data.data.length));

    const response2 = await fetch(`https://api.mangadex.org/manga?${mangaDexSearchParams.toString()}`);

    if(!response2.ok) {
      throw new Error("Failed to fetch favourite mangas");
    }

    const mangaDexData = await response2.json();

    // Covert the MangaDex manga into the client manga type
    const clientManga = await getClientMangaFromMangaDexManga(mangaDexData.data);

    // Set client states
    setTotalFollowedManga(data.count)
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
          <Box 
            sx={{
              width: "500px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1.5,
              borderRadius: "5px",
              padding: "10px",
              border: "1px solid var(--border-dark)",
            }}
          >
            <FormControl sx={{ width: "50%" }}>
              <InputLabel>Release Day</InputLabel>
              <Select 
                value={releaseDay}
                onChange={(e) => {
                  setReleaseDay(e.target.value);
                }}
                label="Release Day" 
              >
                <MenuItem value="Monday">Monday</MenuItem>
                <MenuItem value="Tuesday">Tuesday</MenuItem>
                <MenuItem value="Wednesday">Wednesday</MenuItem>
                <MenuItem value="Thursday">Thursday</MenuItem>
                <MenuItem value="Friday">Friday</MenuItem>
                <MenuItem value="Saturday">Saturday</MenuItem>
                <MenuItem value="Sunday">Sunday</MenuItem>
                <MenuItem value="">None</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ width: "50%"}}>
              <InputLabel>Tier List Rank</InputLabel>
              <Select 
                label="Tier List Rank"
                value={tierListRank}
                onChange={(e) => {
                  setTierListRank(e.target.value as TierListRank)
                }}
              >
                <MenuItem value="GodTier">God Tier</MenuItem>
                <MenuItem value="S">S</MenuItem>
                <MenuItem value="A">A</MenuItem>
                <MenuItem value="B">B</MenuItem>
                <MenuItem value="C">C</MenuItem>
                <MenuItem value="D">D</MenuItem>
                <MenuItem value="F">F</MenuItem>
                <MenuItem value="Dropped">Dropped</MenuItem>
                <MenuItem value="Unranked">Unranked</MenuItem>
                <MenuItem value="">None</MenuItem>
              </Select>
            </FormControl>
          </Box> 
          <PaginationControls totalPages={totalPages} entriesPerPage={entriesPerPage} setEntriesPerPage={setEntriesPerPage} page={page} setPage={setPage}/>
          <MangaGrid mangaList={mangaList} />
        </Stack>
      </ProtectedPage>
    </Box>
  )
}

export default FollowedMangaPage;
