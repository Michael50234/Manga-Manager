'use client';

import { Box, Button, Container, Typography } from "@mui/material";

export default function Home() {

  return (
    <Box sx={{
      backgroundColor: "var(--bg-dark)",
      minHeight: "100vh",
      width: "100vw",
    }}>
      <Container sx={{
        width: "100vhpx",
        height: "100px"
      }}>
        <Typography>Hello</Typography>
        <Button>Content</Button>
      </Container>
    </Box>
  );
}
