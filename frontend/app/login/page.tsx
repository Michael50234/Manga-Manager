"use client";

import { useToast } from "@/components/ToastProvider";
import { useUser } from "@/components/UserProvider";
import { ErrorResponse } from "@/types";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [loginLoading, setLoginLoading] = useState(false);
  const router = useRouter();
  const { showError, showSuccess } = useToast();
  const { loadUser } = useUser();

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateUsername = () => {
    if (username.trim().length < 1) {
      setUsernameError("Username cannot be empty");
      return true;
    } else {
      setUsernameError("");
      return false;
    }
  };

  const validatePassword = () => {
    if (password.length < 6) {
      setPasswordError("Password must have a minimum length of 6");
      return true;
    } else {
      setPasswordError("");
      return false;
    }
  };

  const login = async () => {
    try {
      setLoginLoading(true);
      // Validate the form input
      const usernameError = validateUsername();
      const passwordError = validatePassword();

      // If there is a input validation error, cancel the login
      if(usernameError || passwordError) {
        showError("Username or password is invalid")
        setLoginLoading(false);
        return;
      }

      // Send a request to log the user in
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password,
        }),
        credentials: "include",
      });

      // Handle errors
      if(!response.ok) {
        const error: ErrorResponse = await response.json();
        throw new Error(error.detail)
      }

      const data: {
        detail: string
      } = await response.json();
      
      // Load the user record from the database into the global user state
      await loadUser();
      
      showSuccess(data.detail);

      router.push("/manga")
    } catch(error) {
      if(error instanceof Error) {
        showError(error.message)
      } else {
        showError("Your password or username is incorrect")
      }
    } finally {
      setLoginLoading(false);
    }
  }

  return (
    <Box
      sx={{
        backgroundColor: "var(--bg-dark)",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack
        justifyContent="center"
        spacing={4}
        sx={{
          border: "1px solid var(--border)",
          borderRadius: "10px",
          width: "35%",
          p: "30px",
          backgroundColor: "var(--bg)",
        }}
      >
        <Typography
          sx={{
            fontSize: "2.5rem",
            fontWeight: "600",
          }}
        >
          Login
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Username"
            value={username}
            error={!!usernameError}
            helperText={!!usernameError ? usernameError : ""}
            onChange={(e) => {
              setUsername(e.target.value)
            }}
            sx={{
              "& .MuiFormHelperText-root": {
                mx: "0px",
                my: "2px",
              },
            }}
          />
        <TextField
            label="Password"
            type="password"
            value={password}
            error={!!passwordError}
            helperText={!!passwordError ? passwordError : ""}
            onChange={(e) => {
                setPassword(e.target.value);
            }}
            sx={{
              "& .MuiFormHelperText-root": {
                mx: "0px",
                my: "2px",
              },
            }}
        />
        </Stack>
        <Stack spacing={1} alignItems="center">
          <Button fullWidth disabled={loginLoading} variant="contained" color="primary" onClick={login} sx={{height: "50px"}}>
            {loginLoading ? <CircularProgress /> : "Login"}
          </Button>
          <Typography
            onClick={() => {
                router.push("/")
            }}
            sx={{
              fontSize: "0.9rem",
              color: "var(--text-muted)",
              transition: "border 0.1s ease-in-out",
              borderBottom: "1px solid transparent",
              "&:hover": {
                borderBottom: "1px solid var(--border-dark)",
              },
            }}
          >
            Dont Have An Account. Sign Up Instead.
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
