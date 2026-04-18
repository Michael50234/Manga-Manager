"use client";

import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./theme";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default Provider;
