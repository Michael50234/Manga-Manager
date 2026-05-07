import { useDraggable } from '@dnd-kit/core'
import React from 'react'
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { Box, Typography } from '@mui/material';


type ListItemProps = {
  id: string,
  name: string
  coverImgUrl: string
}

const SortableItem = ({ id, name, coverImgUrl }: ListItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({id})

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Box
      ref={setNodeRef}
      style={{
        ...style,
        height: "100px",
        width: "70px",
        padding: "5px",
        opacity: isDragging ? 0 : 1
      }}
      {...attributes}
      {...listeners}
    >
      <Box component="img" src={coverImgUrl} sx={{height: "100%", width: "100%", objectFit: "cover"}}/>
    </Box>
  )
}

export default SortableItem;
