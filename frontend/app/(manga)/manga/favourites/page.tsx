'use client';

import MangaGrid from '@/components/MangaGrid';
import PaginationControls from '@/components/PaginationControls';
import { FavouriteMangaObject, Manga } from '@/types';
import { Box, Toolbar, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

const FavouritesPage = () => {
  const [mangaList, setMangaList] = useState<Manga[]>([])

  useEffect(() => {
  }, [])

  const loadFavouriteManga = async () => {
    // Get the MangaDex ids of the user's favourite manga's
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/manga/favourites`, {
      method: "GET",
      credentials: "include"
    });

    if(!response.ok) {
      throw new Error("Failed to fetch favourite mangas");
    }

    const favouriteMangaObjects: FavouriteMangaObject[] = await response.json();
    
    // Add default search params
    const searchParams = new URLSearchParams([
        ["includes[]", "author"], 
        ["includes[]", "tag"],
        ["includes[]", "cover_art"]
    ])

    favouriteMangaObjects.forEach((favouriteMangaObject) => {
      searchParams.append("ids[]", favouriteMangaObject.mangaDexId)
    });




    // const response2 = await fetch(``)
  }

  return (
    <Box sx={{
      minHeight: "100vh",
      width: "100%",
      backgroundColor: "var(--bg-dark)"
    }}>
      {/* Add a toolbar here to push everything down and make space for the navbar */}
      <Toolbar />
      <Box>
        <MangaGrid mangaList={mangaList}/>
      </Box>

    </Box>
  )
}

export default FavouritesPage
