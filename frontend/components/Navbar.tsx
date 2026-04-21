'use client'

import { AppBar, Avatar, Box, Button, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'

export const Navbar = () => {
    const pathName = usePathname();
    const router = useRouter();

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
                    <Button variant="text" sx={{
                        fontWeight: "500",
                        color: "black",
                        ml: "auto"
                    }}>
                        <Link href="/">Logout</Link>
                    </Button>
                </Stack>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar
