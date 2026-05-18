'use client';

import ProtectedPage from '@/components/ProtectedPage';
import SortableItem from '@/components/tierList/SortableItem';
import TierListRow from '@/components/tierList/TierListRow';
import { useToast } from '@/components/ToastProvider';
import { GetUserMangaPreferencesResponse, Tier, TierListRank } from '@/types';
import { getMangaDexMangaTitle } from '@/utils/mangaDex';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable';
import { Box, Button, CircularProgress, Stack, Toolbar, Typography } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'

const initalTiers: Tier[] = [
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
  ]

const TierListPage = () => {
  const { showError, showSuccess } = useToast();

  const [tiers, setTiers] = useState<Tier[]>(structuredClone(initalTiers));
  const [mangaRankingsLoading, setMangaRankingsLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  const [activeId, setActiveId] = useState<string | null>(null);
  // The activeItem is guaranteed to exist so we assert that it is not null or undefined
  const activeItem = useMemo(() => {
    for(const tier of tiers) {
      for(const item of tier.items) {
        if(item.id === activeId) {
          return item;
        }
      }
    }
  }, [activeId, tiers])!

  

  // Fetches to ranked series from the database
  useEffect(() => {
    const loadData = async () => {
      try {
        await loadMangaRankings();
      } catch(error) {
        showError("Failed to load manga rankings")
      } finally {
        setMangaRankingsLoading(false);
      }
    }
    
    loadData();
  }, [])

  const loadMangaRankings = async () => {
    // Get the user manga preferences from the database
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/manga/user-manga-preferences`, {
      method: "GET",
      credentials: "include"
    });

    const data: GetUserMangaPreferencesResponse = await response.json();

    const mangaDexSearchParams = new URLSearchParams([
      ['includes[]', 'cover_art'],
      ['limit', `${data.data.length}`]
    ]);

    data.data.forEach((preference) => {
      if(preference.manga) {
        mangaDexSearchParams.append('ids[]', preference.manga.mangaDexId);
      }
    })

    // Fetch the mangaDex data for the manga returned by the database
    const mangaDexResponse = await fetch(`https://api.mangadex.org/manga/?${mangaDexSearchParams.toString()}`);

    const mangaData = await mangaDexResponse.json();

    // Create a copy of the tiers state
    const updatedTiers = structuredClone(initalTiers);

    data.data.forEach((preference) => {
      // Get the tier the manga is in
      const tier = updatedTiers.find((tier) => tier.id === preference.tierListRank)

      if(!tier) {
        return;
      }

      if(!preference.manga) {
        return; 
      }

      // Get the mangaDex manga object for the manga
      const manga = mangaData.data.find((manga: any) => {
        return manga.id === preference.manga!.mangaDexId;
      });

      // Get the cover art relationship object for the manga
      const coverArtRelationship = manga.relationships.find((relationship: any) => {
        return relationship.type === 'cover_art'
      });

      // Add a new item to the tier
      tier.items.push(
        {
            id: preference.manga.mangaDexId, 
            name: getMangaDexMangaTitle(manga),
            coverImgUrl: `https://uploads.mangadex.org/covers/${manga.id}/${coverArtRelationship.attributes.fileName}`
        }
      );
    })

    console.log(updatedTiers)
    // Update the tiers state
    setTiers(updatedTiers);
  }

  const handleSave = async () => {
    try {
      setSaveLoading(true);

      for(const tier of tiers) {
        for(const item of tier.items) {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/manga/${item.id}/user-manga-preference`, {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              tierListRank: tier.id,
            })
          })
        }
      }
    } catch(error) {
      showError("Failed to save changes");
    } finally {
      setSaveLoading(false);
    }
  }

  // Get the tier of an item given its id
  // Two different types of values can be passed into this function:
    // The id of a tier container
    // The id of an item
  const getItemTier = (id: string) => {
    const tierIds: string[] = ["GodTier", "S", "A", "B", "C", "D", "F", "Dropped", "Unranked"];
    let itemTier = null;

    // If the id, is a tierId return it
    if(tierIds.includes(id)) {
      return id;
    }

    // Find which tier the item is in
    for(const tier of tiers) {
      for(const item of tier.items) {
        if(item.id === id) {
          itemTier = tier.id;
        }
      };
    }

    if(!itemTier) {
      throw new Error("Could not find tier for the item");
    }

    return itemTier;
  }

  const handleDragEnd = (e: DragEndEvent) => {
    const tierIds: string[] = ["GodTier", "S", "A", "B", "C", "D", "F", "Dropped", "Unranked"];
    // Reset the activeId state
    setActiveId(null)

    // Take the item being dragged and the item being dragged over from the event object
    const { active, over } = e;

    // If no item was dragged over, return
    if(!over) return;

    // If the item being dragged and the item being dragged over are the same, return
    if(active.id === over.id) return;

    // Get the tiers that the items are in
    const activeTierId = getItemTier(active.id as string);
    const overTierId = getItemTier(over.id as string);

    // This block handles reordering within the same tier
    if(activeTierId === overTierId) {
      // If the item being dragged over is the tier contianer, return
      if(tierIds.includes(over.id as string)) return;

      // Find the tier that the items are in
      const tier = tiers.find((tier) => {
        return tier.id === activeTierId;
      });

      if(!tier) return;

      // Find the position of the active item in the tier
      const activeIdx = tier.items.findIndex((item) => {
        return item.id === active.id;
      });

      // Find the position of the over item in the tier
      const overIdx = tier.items.findIndex((item) => {
        return item.id === over.id;
      });

      // Create an items array with the items reordered
      const reorderedItems = arrayMove(tier.items, activeIdx, overIdx);

      // Update the tiers state
      setTiers((prev) => {
        return prev.map((tier) => {
          if(tier.id !== activeTierId) return tier;

          return {
            ...tier,
            items: reorderedItems
          }
        })
      })
    }

    // This block handles the case where the items are not in the same tier
    if(activeTierId !== overTierId) {
      setTiers((prev) => {
        // Clone the tiers state
        let updatedTiers = structuredClone(prev);

        // Get the index of the tiers of the over and active item
        const activeTierIdx = updatedTiers.findIndex((tier) => {
          return tier.id === activeTierId;
        });

        const overTierIdx = updatedTiers.findIndex((tier) => {
          return tier.id === overTierId;
        });

        // Get the index of the over item in its tier
        const overIdx = updatedTiers[overTierIdx].items.findIndex((item) => {
          return item.id === over.id;
        })

        // Get the active item
        // We assert that it is not null or undefined because previously we checked that it exists in a tier
        const activeItem = updatedTiers[activeTierIdx].items.find((item) => {
          return item.id === active.id;
        })!

        // Remove the active item from its tiers items (since its being moved to another tier)
        updatedTiers[activeTierIdx].items = updatedTiers[activeTierIdx].items.filter((item) => {
          return item.id !== active.id;
        });

        // Add the active item to the over tier
        if(tierIds.includes(over.id as string)) {
          // Run this block if over is a tier container

          // Add the active item to the end of the tier
          updatedTiers[overTierIdx].items = [
            ...updatedTiers[overTierIdx].items,
            activeItem
          ]
        } 
        else {
          // Run this block if over is an item

          // Add the active item right before the over item
          const updatedOverTierItems = [
            ...updatedTiers[overTierIdx].items.slice(0, overIdx),
            activeItem,
            ...updatedTiers[overTierIdx].items.slice(overIdx)
          ]

          updatedTiers[overTierIdx].items = updatedOverTierItems;
        }

        return updatedTiers;
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
        width: "98vw",
        p: "20px",
        backgroundColor: "var(--bg-dark)",
      }}
    >
      <Toolbar />
      <Stack 
        alignItems="center"
        justifyItems="center"
        spacing={2}
        sx={{
          width: "100%",
          mt: "20px"
        }}
      >
        <ProtectedPage isContentLoading={mangaRankingsLoading}>
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
              <DragOverlay>
                { activeId ? (
                  <SortableItem id={activeItem.id} name={activeItem.name} coverImgUrl={activeItem.coverImgUrl}/>
                ) : (
                  undefined
                )}
              </DragOverlay>
            </DndContext>
          </Stack>
          <Button 
            variant="contained" 
            onClick={handleSave}
            sx={{
              height: "40px",
              minWidth: "100px"
            }}
          >
            {saveLoading ? <CircularProgress /> : "Save"}
          </Button>
        </ProtectedPage>
      </Stack>
    </Box>
  )
}

export default TierListPage
