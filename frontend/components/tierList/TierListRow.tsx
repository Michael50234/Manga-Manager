import { Item } from '@/types'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { Box, Typography } from '@mui/material'
import React from 'react'
import SortableItem from './SortableItem'

type TierListRowProps = {
  id: string,
  name: string, 
  items: Item[]
}

const TierListRow = ({ id, name, items }: TierListRowProps) => {
  const { isOver, setNodeRef } = useDroppable({id});

  return (
    <Box 
      sx={{
        minHeight: "80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "80%"
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center", 
          alignSelf: "stretch",
          border: "solid 1px black",
          backgroundColor: "var(--bg)",
          width: "100px",
          minWidth: "80px"
        }}
      >
        <Typography sx={{ fontSize: "0.9rem", fontWeight: 500 }}>{name}</Typography>
      </Box>
      <Box
        ref={setNodeRef}
        sx={{
          alignSelf: "stretch",
          width: "1000px",
          border: "solid 1px black",
          backgroundColor: "hsl(270, 30%, 88%)"
        }}
      >
        <SortableContext items={items.map((item) => item.id)}>
          {items.map((item) => {
            return <SortableItem key={item.id} id={item.id} name={item.name}/>
          })}
        </SortableContext>
      </Box>
    </Box>
  )
}

export default TierListRow
