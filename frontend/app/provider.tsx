"use client";

import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import ToastProvider from "@/components/ToastProvider";
import UserProvider from "@/components/UserProvider";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ToastProvider>
      <UserProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </UserProvider>
    </ToastProvider>
  );
};

export default Provider;
