'use client';

import { Manga } from '@/types'
import { getClientMangaFromMangaDexManga } from '@/utils/mangaDex';
import { Close, StarBorder } from '@mui/icons-material'
import { Box, Button, Chip, CircularProgress, Dialog, DialogTitle, Icon, IconButton, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useToast } from './ToastProvider';

type MangaCardProps = {
  manga: Manga,
  isFavourited: boolean,
  isFollowed: boolean,
}

const MangaCard = ({ manga }: MangaCardProps) => {
  const { showError, showSuccess } = useToast();

  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [preferenceDialogOpen, setPreferenceDialogOpen] = useState(false);
  
  const [recomendedMangaLoading, setRecommendedMangaLoading] = useState(false);
  const [recommendedManga, setRecomendedManga] = useState<Manga[]>([]);


  const handleDetailDialogClose = () => {
    setDetailDialogOpen(false);
  }

  const handlePreferenceDialogClose = () => {
    setPreferenceDialogOpen(false);
  }

  const fetchRecommendedManga = async () => {
    try {
      setRecommendedMangaLoading(true);

      // Fetch the recommendations for the given manga
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/manga/${manga.id}/recommended?includes[]=cover_art`, {
        method: "GET",
        credentials: "include",
      })

      if(!response.ok) {
        throw new Error("Failed to load resources");
      }

      const data = await response.json();

      // Take the ids of the top 5 manga
      const recommendedMangaIds = data.data.splice(0, 5).map((mangaRecommendation: any) => {
        return mangaRecommendation.relationships[1].id
      })

      // Add the default query parameters
      const searchParams = new URLSearchParams([
        ['includes[]', 'cover_art'],    
        ["includes[]", "author"],
        ["includes[]", "tag"],
        ['limit', "5"]
      ]);

      // Add the ids of the recomended manga to the query parameters
      recommendedMangaIds.forEach((mangaId: string) => {
        searchParams.append("ids[]", mangaId);
      });

      // Fetch the recomended manga from MangaDex using their ids
      const recomendedMangaResponse = await fetch(`https://api.mangadex.org/manga?${searchParams.toString()}`);

      const recommendedMangaList = await recomendedMangaResponse.json();

      // Convert the MangaDex manga to the client manga type
      const clientMangaList = await getClientMangaFromMangaDexManga(recommendedMangaList.data);

      console.log(clientMangaList);

      setRecomendedManga(clientMangaList);
    } catch(error) {
      showError("Failed to load resources");
    } finally {
      setRecommendedMangaLoading(false);
    }
  }

  return (
    <>
    {/* Manga Card */}
      <Stack sx={{
        backgroundColor: "var(--muted-surface)",
        height: "190px",
        borderRadius: "10px",
        justifyContent: "center",
        px: "10px",
      }}>
        {/* Action Bar */}
        <Stack direction="row" sx={{
          alignSelf: "start",
          alignItems: "center"
        }}>
          <StarBorder sx={{
            borderRadius: "50%",
            transform: "backgroundColor 0.3s ease-in-out",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)"
            }
          }}/>
          <Button variant="text" color="primary" onClick={() => setPreferenceDialogOpen(true)}>
            Edit Manga Preference
          </Button>
        </Stack>

        {/* Manga Info */}
        <Stack direction="row" sx={{
          columnGap: "10px"
        }}>
          <Box component="img" src={manga.coverImageUrl} sx={{
            height: "130px",
            width: "90px",
            objectFit: "cover"
          }}/>
          <Stack spacing={0.8}>
            <Stack spacing={0.3}>
              <Typography sx={{
                maxWidth: "200px",
                whiteSpace: 'nowrap',
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}>
                <strong>{manga.title}</strong>
              </Typography>
              <Typography>{`Ch. ${manga.latestChapter}`}</Typography>
              <Typography sx={{
                maxWidth: "200px",
                overflow: "hidden",
                fontSize: "0.9rem",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis"
              }}>{manga.author}</Typography>
              <Typography sx={{
                fontSize: "0.8rem",
                maxWidth: "200px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}>
                Last Updated <em>{(new Date(manga.lastUpdatedAt)).toDateString()}</em>
              </Typography>
            </Stack>
            <Typography
              sx={{
                fontSize: "0.9rem",
                width: "fit-content",
                "&:hover": {
                  textDecoration: "underline",
                  color: "var(--primary-hover)"
                },
              }}
              onClick={async () => {
                setDetailDialogOpen(true)
                await fetchRecommendedManga();
              }}
            >
              View Details
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      {/* Manga detail dialog */}
      <Dialog
        open={detailDialogOpen}
        fullWidth={true}
        maxWidth="md"
        onClose={handleDetailDialogClose}
      >
        <Stack 
          alignItems="center" 
          spacing={1.5}
          sx={{ 
            width: "100%",
            p: "10px",
            minHeight: "500px",
            backgroundColor: "var(--bg-dark)"
          }}
        >
          { recomendedMangaLoading ? (
              <Box
                sx={{
                  width: "100%",
                  minHeight: "500px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                >
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Box 
                  sx={{
                    position: "relative", 
                    width: "100%",
                  }}
                >
                  <Typography 
                    sx={{
                      fontSize: "2rem",
                      fontWeight: 600,
                      position: "relative", 
                      top: 0,
                      left: 0,
                      right: 0,
                      textAlign: "center",
                      px: "10px"
                    }}
                  >
                    {manga.title}
                  </Typography>
                  <IconButton 
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                    }}
                  >
                    <Close />
                  </IconButton>
                </Box>
                <Stack direction="row" spacing={2}>
                  <Box 
                    component="img" 
                    src={manga.coverImageUrl} 
                    sx={{
                      height: "400px",
                      width: "300px",
                      objectFit: "cover"
                    }}
                  />
                  <Stack spacing={2}>
                    <Box  
                      sx={{
                        backgroundColor: "var(--muted-surface)",
                        borderRadius: "5px",
                        p: "2px"
                      }}
                    >
                      {manga.tags.map((tag) => {
                        return <Chip key={tag.id} label={tag.name} sx={{ m: "2px" }}/>
                      })}
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 550}}>Description</Typography>
                      <Typography 
                        sx={{
                          backgroundColor: "var(--muted-surface)",
                          borderRadius: "5px",
                          maxWidth: "580px",
                          whiteSpace: "normal",
                          overflowWrap: "break-word", 
                          wordBreak: "break-word",
                        }}
                      >
                        {manga.description}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
                <Typography sx={{ alignSelf: "start", py: "3px", color: "var(--text-muted)"}}>If you liked this, you might like: </Typography>
                <Stack direction="row" spacing={3}>
                    { recommendedManga.map((manga) => {
                      
                      return (
                        <Box key={manga.id} sx={{ backgroundColor: "var(--bg)", p: "5px", borderRadius: "5px" }}>
                          <Box component="img" src={manga.coverImageUrl} sx={{
                            height: "200px",
                            width: "140px",
                            objectFit: "cover",
                          }}/>
                          <Typography sx={{
                            maxWidth: "140px", 
                            fontSize: "0.9rem",
                            display: "-webkit-box",
                            // Limit number of lines to 2 
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}>
                            {manga.title}
                          </Typography>
                        </Box>
                      )
                    })}
                </Stack>
              </>
            )
          }
        </Stack>
      </Dialog>
      {/* Manga Preference Dialog */}
      <Dialog
        open={preferenceDialogOpen}
        fullWidth={true}
        maxWidth="md"
        onClose={handlePreferenceDialogClose}
      >
        <Typography>Hellosadd</Typography>
      </Dialog>
    </>
  )
}

export default MangaCard
