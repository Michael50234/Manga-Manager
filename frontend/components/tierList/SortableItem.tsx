import { useDraggable } from '@dnd-kit/core'
import React from 'react'
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { Box, Typography } from '@mui/material';


type ListItemProps = {
  id: string,
  name: string
}

const SortableItem = ({ id, name }: ListItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({id})

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Box
      ref={setNodeRef}
      style={{
        ...style,
        height: "40px",
        width: "50px"
      }}
      {...attributes}
      {...listeners}
    >
      <Typography>{name}</Typography>
    </Box>
  )
}

export default SortableItem;
