'use client';

import TierListRow from '@/components/tierList/TierListRow';
import { Tier } from '@/types';
import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { Box, Button, Stack, Toolbar, Typography } from '@mui/material'
import { useEffect, useState } from 'react'


const TierListPage = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [tiers, setTiers] = useState<Tier[]>([
    {
      id: "GodTier", 
      name: "God Tier",
      items: []
    }, 
    {
      id: "S",
      name: "S",
      items: []
    }, 
    {
      id: "A",
      name: "A",
      items: []
    }, 
    {
      id: "B",
      name: "B",
      items: []
    }, 
    {
      id: "C",
      name: "C",
      items: []
    },
    {
      id: "D",
      name: "D",
      items: []
    }, 
    {
      id: "F",
      name: "F",
      items: []
    }, 
    {
      id: "Dropped",
      name: "Dropped",
      items: []
    }, 
    {
      id: "Unranked", 
      name: "Unranked",
      items: []
    }
  ]);

  // Fetches to ranked series from the database
  useEffect(() => {
    const loadData = async () => {
      try {
        await loadMangaRankings();
      } catch(error) {

      } finally {

      }
    }

    loadData();
  }, [])

  const loadMangaRankings = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/manga/user-manga-preferences`, {
      method: "GET",
      credentials: "include"
    })

    const data = await response.json()

    console.log(data)
  }

  const getItemTier = () => {

  }

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(null)

    const { active, over } = e;

    // If an item is being dragged over and its not the item being dragged itself, do the following
    if(over && active.id !== over.id) {
      setTiers((tiers) => {
        return tiers
      })

    }

  }

  const handleDragStart = (e: DragStartEvent) => {
    setActiveId(e.active.id as string);
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "var(--bg-dark)",
      }}
    >
      <Toolbar />
      <Stack 
        alignItems="center"
        justifyItems="center"
        spacing={2}
        sx={{
          width: "100vw",
          mt: "20px"
        }}
      >
        <Stack alignItems="center" justifyContent="center" sx={{ width: "100%" }}>
          <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {tiers.map((tier) => {
              return (
                <TierListRow key={tier.id} id={tier.id} name={tier.name} items={tier.items} />
              )
            })}
          </DndContext>
        </Stack>
        <Button variant="contained">Save</Button>
      </Stack>
    </Box>
  )
}

export default TierListPage
