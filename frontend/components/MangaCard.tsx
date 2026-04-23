'use client';

import { Manga } from '@/types'
import { StarBorder } from '@mui/icons-material'
import { Box, Button, IconButton, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'

type MangaCardProps = {
  manga: Manga
}

const MangaCard = ({ manga }: MangaCardProps) => {
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [preferenceDialogOpen, setPreferenceDialogOpen] = useState(false);

  return (
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
        <Button variant="text" color="primary">
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
          >
            View Details
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default MangaCard
