'use client'

import { AppBar, Avatar, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Menu, MenuItem, Stack, TextField, Toolbar, Typography } from '@mui/material';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'
import { useToast } from './ToastProvider';
import { useEffect, useState } from 'react';
import { useUser } from './UserProvider';

export const Navbar = () => {
    const pathName = usePathname();
    const router = useRouter();

    const { showSuccess, showError } = useToast();
    const { setUser, user, loadUser } = useUser();

    const [logoutLoading, setLogoutLoading] = useState(false);
    const [saveUserLoading, setSaveUserLoading] = useState(false);

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const open = Boolean(anchorEl);

    const [dialogOpen, setDialogOpen] = useState(false);

    const [email, setEmail] = useState("");
    const [nickname, setNickname] = useState("")
    const [bio, setBio] = useState("")

    useEffect(() => {
        if(user) {
            setEmail(user.email);
            setNickname(user.nickname);
            if(user.bio) {
                setBio(user.bio);
            }
            
        }
    // Added dialogOpen to dependencies so that changes would reset if they are not saved
    }, [user, dialogOpen])

    const save = async () => {
        try {
            setSaveUserLoading(true);

            // Save the changes to the user to the database
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/update`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    nickname,
                    bio,
                })
            });

            if(!response.ok) {
               throw new Error("Failed to save changes");
            }

            // Reload the global user state to prevent it from going stale
            await loadUser();

            showSuccess("Successfully saved changes");
        } catch {
            showError("Failed to save changes")
        } finally {
            setSaveUserLoading(false);
        }
    }

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

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
    };

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
                        <IconButton
                            onClick={(e) => {
                                setAnchorEl(e.currentTarget)
                            }}
                        >
                            <Avatar>
                                <Box component="img" src="/Frieren.png" sx={{
                                    transform: "translateY(30px) scale(0.3)"
                                }} />
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
                            data-active={pathName === "/manga/followed" ? "" : undefined}
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
                                backgroundColor: pathName === "/manga/followed" ? "var(--primary)" : "transparent",
                                boxShadow: pathName === "/manga/followed" ? "0 -3px 0 var(--primary-hover) inset" : undefined,
                                "&:hover:not([data-active=''])" : {
                                    boxShadow: "0 -3px 0 var(--primary-hover) inset"
                                },
                            }}
                        >
                            <Link href="/manga/followed">Followed Series</Link>
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
                <Menu 
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    onClick={() => {
                        setAnchorEl(null);
                        setDialogOpen(true)
                    }}
                >
                    <MenuItem>
                        Edit Profile
                    </MenuItem>
                </Menu>
                <Dialog
                    open={dialogOpen}
                    onClose={handleDialogClose}
                    maxWidth="sm"
                    fullWidth
                    slotProps={{
                        paper: {
                            sx: {
                                p: "8px"
                            }
                        }
                    }}
                >
                    <DialogTitle
                        sx={{
                            fontSize: "2rem"

                        }}
                    >
                        Profile
                        <Stack>
                            <Typography 
                                sx={{
                                    fontSize: "0.8rem",
                                    color: "var(--text-muted)"
                                }}
                            >
                                Created At {user ? new Date(user?.createdAt).toLocaleDateString() : "n/a"}
                            </Typography>
                            <Typography 
                                sx={{
                                    fontSize: "0.8rem",
                                    color: "var(--text-muted)"
                                }}
                            >
                                Last Updated At {user ? new Date(user?.lastUpdatedAt).toLocaleDateString() : "n/a"}
                            </Typography>
                        </Stack>
                    </DialogTitle>
                    <DialogContent sx={{ py: "2px"}}>
                        <Stack 
                            sx={{ pt: "10px"}}
                            spacing={1.5}
                        >
                            <TextField 
                            
                                label="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField 
                                label="Nickname" 
                                value={nickname}
                                onChange={(e) =>  setNickname(e.target.value)}
                            />
                            <TextField 
                                value={bio} 
                                onChange={(e) => setBio(e.target.value)}
                                label="Bio"
                                multiline
                                minRows={5}
                                maxRows={5}
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ width: "100%", display: "flex", justifyContent: "center", alignContent: "center"}}>
                        <Button 
                            variant="contained" 
                            color="primary"
                            sx={{
                                px: "30px"
                            }}
                            onClick={save}
                        >
                            {saveUserLoading ? (
                                <CircularProgress />
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar
