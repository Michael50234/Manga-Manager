"use client";

import { useToast } from "@/components/ToastProvider";
import { useUser } from "@/components/UserProvider";
import { ErrorResponse } from "@/types";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const { user, loadUser } = useUser();
  const { showError, showSuccess } = useToast();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateUsername = () => {
    if (username.trim().length < 1) {
      setUsernameError("Username cannot be empty");
    } else {
      setUsernameError("");
    }
  };

  const validateEmail = () => {
    const emailRegex = /@.+\.com/;

    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = () => {
    if (password.length < 6) {
      setPasswordError("Password must have a minimum length of 6");
    } else {
      setPasswordError("");
    }
  };

  const signUp = async () => {
    try {

      // Validate form input
      validateEmail();
      validatePassword();
      validateUsername();

      if(emailError || passwordError || usernameError) {
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username, 
          email,
          password,
        })
      })

      if(!response.ok) {
        const error: ErrorResponse = await response.json()
        throw new Error(error.detail)
      }

      const data: {
        detail: string
      } = await response.json();
      
      await loadUser();
      showSuccess(data.detail)
    } catch(error) {
      if(error instanceof Error) {
        showError(error.message)
      } else {
        throw new Error("Username or password is incorrect")
      }

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
          Sign Up
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Email"
            error={!!emailError}
            helperText={!!emailError ? emailError : ""}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            sx={{
              "& .MuiFormHelperText-root": {
                mx: "0px",
                my: "2px",
              },
            }}
          />
          <TextField
            label="Username"
            value={username}
            error={!!usernameError}
            helperText={!!usernameError ? usernameError : ""}
            onChange={(e) => {
              setUsername(e.target.value);
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
          <Stack spacing={1} alignItems="center">
            <Button fullWidth variant="contained" color="primary" onClick={signUp}>
              Sign Up
            </Button>
            <Typography
              onClick={() => {
                router.push("/login");
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
              Already Have An Account. Log In Instead.
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
