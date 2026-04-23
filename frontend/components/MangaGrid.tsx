import { Box, Typography } from '@mui/material'
import { Manga } from '../types'
import MangaCard from './MangaCard'

type MangaGridProps = {
    mangaList: Manga[]
}

const MangaGrid = ({mangaList}: MangaGridProps) => {
    return (
        <Box sx={{
            display: "grid",
            gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr 1fr",
                lg: "1fr 1fr 1fr 1fr",
                xl: "1fr 1fr 1fr 1fr 1fr",
            },
            gridAutoRows: "200px",
            width: "90%",
            gap: 2,
        }}>
            { mangaList.map((manga) => {
                return <MangaCard key={manga.id} manga={manga}/>
            })}
        </Box>
    )
}

export default MangaGrid
