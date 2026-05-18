'use client';

import { Box, Typography } from '@mui/material'
import { FavouriteMangaObject, Manga, UserMangaPreference, GetUserMangaPreferencesResponse } from '../types'
import MangaCard from './MangaCard'
import { useEffect, useState } from 'react';
import { useToast } from './ToastProvider';

type MangaGridProps = {
    mangaList: Manga[]
}

const MangaGrid = ({mangaList}: MangaGridProps) => {
    const { showSuccess, showError } = useToast();

    const [favouriteMangaSet, setFavouriteMangaSet] = useState<Set<string>>(new Set());
    // This is the set of manga that the user has created preferences for
    const [followedMangaSet, setFollowedMangaSet] = useState<Set<string>>(new Set());

    // Load the favourited and followed manga from the backend
    useEffect(() => {
        const loadData = async () => {
            try {
                // Load favourite and followed manga populating the followed and favourite manga sets
                await loadFavouriteManga(); 
                await loadFollowedManga();
            } catch(error) {
                showError("Failed to fetch resources");
            }
        }

        loadData();
    }, []);

    const loadFollowedManga = async () => {
        // Get users manga preferences
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/manga/user-manga-preferences`, {
            method: "GET",
            credentials: "include",
        });

        if(!response.ok) {
            throw new Error("Failed to fetch resources");
        }

        const data: GetUserMangaPreferencesResponse = await response.json();

        // Create a set of the ids of manga that have preferences
        const followedMangaSet: Set<string> = new Set();
        data.data.forEach((preference: GetUserMangaPreferencesResponse['data'][number]) => {
            if(preference.manga) {
                followedMangaSet.add(preference.manga.mangaDexId)
            }
        });

        // Set the followedMangaSet state
        setFollowedMangaSet(followedMangaSet);
    }

    const loadFavouriteManga = async () => {
        // Fetch favourite manga from the backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/manga/favourites`, {
            method: "GET",
            credentials: "include"
        });

        if(!response) {
            throw new Error("Failed to fetch resources");
        }

        const data: { data: FavouriteMangaObject[], count: number } = await response.json();

        const favouriteMangaSet: Set<string> = new Set();

        data.data.forEach((favouriteManga) => {
            favouriteMangaSet.add(favouriteManga.mangaDexId)
        })

        // Set favouriteMangaSetState
        setFavouriteMangaSet(favouriteMangaSet);
    }

    return (
        <Box sx={{
            display: "grid",
            gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr 1fr",
                lg: "1fr 1fr 1fr 1fr",
                xl: "1fr 1fr 1fr 1fr",
            },
            gridAutoRows: "200px",
            overflowX: "hidden",
            width: "90%",
            gap: 2,
            height: "90%"
        }}>
            { mangaList.map((manga) => {
                return <MangaCard loadFollowedManga={loadFollowedManga} loadFavouriteManga={loadFavouriteManga} isFavourited={favouriteMangaSet.has(manga.id)} isFollowed={followedMangaSet.has(manga.id)}key={manga.id} manga={manga}/>
            })}
        </Box>
    )
}

export default MangaGrid
