'use client'

import { AppBar, Avatar, Box, Button, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'
import { useToast } from './ToastProvider';
import { useState } from 'react';
import { useUser } from './UserProvider';

export const Navbar = () => {
    const pathName = usePathname();
    const router = useRouter();

    const { showSuccess, showError } = useToast();
    const { setUser } = useUser();

    const [logoutLoading, setLogoutLoading] = useState(false)

    const logout = async () => {
        try {
            setLogoutLoading(true);
            // This clears the JWT token cookie
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/logout`, {
                method: "POST",
                credentials: "include"
            })

            if(!response.ok) {
                throw new Error("Failed to logout")
            }

            setUser(null);

            const data = await response.json();

            showSuccess(data.detail);
            router.replace("/");
        } catch(error) {
            showError("Failed to logout");
        } finally {
            setLogoutLoading(false);
        }
    }

    return (
        <AppBar position="fixed">
            <Toolbar variant="dense" sx={{
                backgroundColor: "var(--bg)",
                py: "4px"
            }}>
                <Stack direction="row" sx={{
                    width: "100%"
                }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <IconButton>
                            <Avatar>
                                <Box component="img" src="/Frieren.png" sx={{
                                    transform: "translateY(30px) scale(0.3)"
                                }}></Box>
                            </Avatar>
                        </IconButton>
                        <Button variant={ pathName === "/manga" ? "contained" : "text"} sx={{
                            color: "black",
                            fontWeight: "500",
                            height: "40px",
                            px: "8px",
                            py: "3px",
                            "&.MuiButton-contained": {
                                backgroundColor: "var(--bg-light)"
                            }
                        }}>
                            <Link href="/manga">Dashboard</Link>
                        </Button>
                        <Button variant={ pathName === "/manga/favourites" ? "contained" : "text"} sx={{
                            color: "black",
                            fontWeight: "500",
                            height: "40px",
                            px: "8px",
                            py: "3px",
                            "&.MuiButton-contained": {
                                backgroundColor: "var(--bg-light)"
                            }
                        }}>
                            <Link href="/manga/favourites">Favourited Series</Link>
                        </Button>
                        <Button variant={ pathName === "/manga/tier-list" ? "contained" : "text"} sx={{
                            color: "black",
                            fontWeight: "500",
                            height: "40px",
                            px: "8px",
                            py: "3px",
                            "&.MuiButton-contained": {
                                backgroundColor: "var(--bg-light)"
                            }
                        }}>
                            <Link href="/manga/tier-list">Tier List</Link>
                        </Button>
                    </Stack>
                    <Button 
                        variant="text" 
                        sx={{
                            fontWeight: "500",
                            color: "black",
                            ml: "auto"
                        }}
                        disabled={logoutLoading}
                        onClick={logout}
                    >
                        <Link href="/">Logout</Link>
                    </Button>
                </Stack>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar
