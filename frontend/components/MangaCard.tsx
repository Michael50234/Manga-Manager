'use client';

import { DaysOfWeek, Manga, TierListRank, UserMangaPreference, UserMangaPreferenceResponse } from '@/types'
import { getClientMangaFromMangaDexManga } from '@/utils/mangaDex';
import { Close, StarBorder } from '@mui/icons-material'
import { Box, Button, Chip, CircularProgress, Dialog, DialogTitle, FormControl, FormControlLabel, FormLabel, Icon, IconButton, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useToast } from './ToastProvider';

type MangaCardProps = {
  manga: Manga,
  isFavourited: boolean,
  isFollowed: boolean,
}

const MangaCard = ({ manga, isFavourited, isFollowed }: MangaCardProps) => {
  const { showError, showSuccess } = useToast();

  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [preferenceDialogOpen, setPreferenceDialogOpen] = useState(false);
  
  const [recomendedMangaLoading, setRecommendedMangaLoading] = useState(false);
  const [recommendedManga, setRecomendedManga] = useState<Manga[]>([]);

  const [userMangaPreference, setUserMangaPreference] = useState<UserMangaPreference>({
    sendNotifications: false,
    tierListRank: "Unranked" as TierListRank,
    mangaAccessLink: "",
    mangaReleaseDay: "",
  });
  const [userMangaPreferenceLoading, setUserMangaPreferenceLoading] = useState(false);
  const [userMangaPreferenceSaveLoading, setUserMangaPreferenceSaveLoading] = useState(false);

  const setMangaAccessLink = (newLink: string) => {
    setUserMangaPreference((prev) => {
      return {
        ...prev,
        mangaAccessLink: newLink,
      }
    })
  }

  const setSendNotifications = (newValue: boolean) => {
    setUserMangaPreference((prev) => {
      return {
        ...prev,
        sendNotifications: newValue
      }
    })
  }

  const setMangaReleaseDay = (newDay: DaysOfWeek) => {
    setUserMangaPreference((prev) => {
      return {
        ...prev,
        mangaReleaseDay: newDay
      }
    })
  }

  const setTierListRank = (newRank: TierListRank) => {
    setUserMangaPreference((prev) => {
      return {
        ...prev,
        tierListRank: newRank,
      }
    })
  }

  const handleDetailDialogClose = () => {
    setDetailDialogOpen(false);
  }

  const handlePreferenceDialogClose = () => {
    setPreferenceDialogOpen(false);

    // Reset the userMangaPreference state
    setUserMangaPreference({
      sendNotifications: false,
      tierListRank: "Unranked" as TierListRank,
      mangaAccessLink: "",
      mangaReleaseDay: "",
    })
  }

  const fetchUserMangaPreference = async () => {
    if(isFollowed) {
      try {
        setUserMangaPreferenceLoading(true);
        
        // Fetch existing manga preference from backend if it exists
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/manga/${manga.id}/user-manga-preference`, {
          method: "GET",
          credentials: "include"
        });
        
        const data: UserMangaPreferenceResponse = await response.json();

        console.log("Preference", data)
        // Set the userMangaPreferenceState
        setUserMangaPreference({
          mangaAccessLink: data.mangaAccessLink ?? "",
          sendNotifications: data.sendNotifications,
          tierListRank: data.tierListRank,
          mangaReleaseDay: data.mangaReleaseDay ?? "",
        })
      } catch(error) {
        showError("Failed to load resources");
      } finally {
        setUserMangaPreferenceLoading(false);
      }
    }
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
          <Button 
            variant="text" 
            color="primary" 
            sx={{ 
              color: "var(--text)", 
              fontSize: "0.9rem", 
              fontWeight: 400
            }} 
            onClick={() => {
              setPreferenceDialogOpen(true);
              fetchUserMangaPreference();
            }}
          >
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
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "var(--bg-dark)"
            }
          }
        }}
      >
        <Stack 
          alignItems="center" 
          spacing={1.5}
          sx={{ 
            width: "100%",
            p: "10px",
            minHeight: "500px",
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
        maxWidth="sm"
        onClose={handlePreferenceDialogClose}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "var(--bg-dark)"
            }
          }
        }}
      >
        <Stack 
          alignItems="center" 
          sx={{
            minHeight: "600px",
            p: "20px", 
          }}
          spacing={2}
        >
          { userMangaPreferenceLoading ? (
            <Box sx={{
              height: "600px",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Typography sx={{
                fontWeight: 600,
                textAlign: "center", 
                fontSize: "2rem",
              }}>
                {manga.title}
              </Typography>
              <Box sx={{ height: "350px", width: "250px", objectFit: "cover" }} component="img" src={manga.coverImageUrl}/>
              <Stack spacing={1}>

                <FormControlLabel 
                  label="Send Notifications" 
                  control={
                    <Switch 
                      checked={userMangaPreference.sendNotifications} 
                      onChange={(e) => setSendNotifications(e.target.checked)} 
                    />}
                />
                <TextField label="Manga Access Link" value={userMangaPreference.mangaAccessLink} onChange={(e) => setMangaAccessLink(e.target.value)}/>
                <FormControl>
                  <InputLabel>Manga Release Day</InputLabel>
                  <Select label="Manga Release Day" value={userMangaPreference.mangaReleaseDay} onChange={(e) => setMangaReleaseDay(e.target.value)}>
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
                <FormControl fullWidth>
                  <InputLabel>Tier List Rank</InputLabel>
                  <Select label="Tier List Rank" value={userMangaPreference.tierListRank} onChange={(e) => setTierListRank(e.target.value)}>
                    <MenuItem value="GodTier">God Tier</MenuItem>
                    <MenuItem value="S">S</MenuItem>
                    <MenuItem value="A">A</MenuItem>
                    <MenuItem value="B">B</MenuItem>
                    <MenuItem value="C">C</MenuItem>
                    <MenuItem value="D">D</MenuItem>
                    <MenuItem value="F">F</MenuItem>
                    <MenuItem value="Dropped">Dropped</MenuItem>
                    <MenuItem value="Unranked">Unranked</MenuItem>
                  </Select>
                </FormControl>
                <Button 
                  variant="contained"
                  onClick={async () => {
                    try {
                      setUserMangaPreferenceSaveLoading(true);
                      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/manga/${manga.id}/user-manga-preference`, {
                        // Base the method on whether the user has existing preferences for this manga
                        method: isFollowed ? "PATCH" : "POST", 
                        credentials: "include",
                        headers: {
                          "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                          mangaAccessLink: userMangaPreference.mangaAccessLink?.trim() ? userMangaPreference.mangaAccessLink : undefined, 
                          sendNotifications: userMangaPreference.sendNotifications,
                          mangaReleaseDay: userMangaPreference.mangaReleaseDay ? userMangaPreference.mangaReleaseDay : undefined,
                          tierListRank: userMangaPreference.tierListRank,
                        })
                      }); 

                      if(!response.ok) {
                        throw new Error("Failed to save manga preference");
                      }

                      showSuccess("Successfully saved manga preference");

                    } catch {
                      showError("Failed to save manga preference");
                    } finally {
                      setUserMangaPreferenceSaveLoading(false);
                    }
                  }}
                >
                  { userMangaPreferenceSaveLoading ? <CircularProgress /> : "Save"}
                </Button>
              </Stack>
            </>
          )}
        </Stack>
      </Dialog>
    </>
  )
}

export default MangaCard
