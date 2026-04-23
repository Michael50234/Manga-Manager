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
                py: "0px"
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
                        <Typography 
                            data-active={pathName === "/manga" ? "" : undefined}
                            sx={{
                                transition: "background 0.1s ease-in-out",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                color: "black",
                                fontWeight: "500",
                                height: "100%",
                                display: "flex",
                                px: "2px",
                                backgroundColor: pathName === "/manga" ? "var(--primary)" : "transparent",
                                boxShadow: pathName === "/manga" ? "0 -3px 0 var(--primary-hover) inset" : undefined,
                                "&:hover:not([data-active=''])" : {
                                    boxShadow: "0 -3px 0 var(--primary-hover) inset"
                                },
                            }}
                        >
                            <Link href="/manga">Dashboard</Link>
                        </Typography>
                        <Typography
                            data-active={pathName === "/manga/favourites" ? "" : undefined}
                            sx={{
                                transition: "background 0.1s ease-in-out",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                color: "black",
                                fontWeight: "500",
                                height: "100%",
                                display: "flex",
                                px: "2px",
                                backgroundColor: pathName === "/manga/favourites" ? "var(--primary)" : "transparent",
                                boxShadow: pathName === "/manga/favourites" ? "0 -3px 0 var(--primary-hover) inset" : undefined,
                                "&:hover:not([data-active=''])" : {
                                    boxShadow: "0 -3px 0 var(--primary-hover) inset"
                                },
                            }}
                        >
                            <Link href="/manga/favourites">Favourited Series</Link>
                        </Typography>
                        <Typography
                            data-active={pathName === "/manga/tier-list" ? "" : undefined}
                            sx={{
                                transition: "background 0.1s ease-in-out",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                color: "black",
                                fontWeight: "500",
                                height: "100%",
                                display: "flex",
                                px: "2px",
                                backgroundColor: pathName === "/manga/tier-list" ? "var(--primary)" : "transparent",
                                boxShadow: pathName === "/manga/tier-list" ? "0 -3px 0 var(--primary-hover) inset" : undefined,
                                "&:hover:not([data-active=''])" : {
                                    boxShadow: "0 -3px 0 var(--primary-hover) inset"
                                },
                            }}
                        >
                            <Link href="/manga/tier-list">Tier List</Link>
                        </Typography>
                    </Stack>
                    <Button 
                        variant="text" 
                        sx={{
                            borderRadius: "10px",
                            height: "40px",
                            textTransform: "none",
                            fontWeight: "500",
                            color: "black",
                            ml: "auto",
                            mt: "auto",
                            mb: "auto",
                            "&:hover": {
                                backgroundColor: "primary.main"
                            }
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
