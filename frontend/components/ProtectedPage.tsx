'use client';

import React, { useEffect, useState } from 'react'
import { useUser } from './UserProvider'
import { useRouter } from 'next/navigation';
import { Backdrop, Box, CircularProgress } from '@mui/material';

const ProtectedPage = ({ children }: { children: React.ReactNode}) => {
  const { user, userLoading } = useUser();
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if(userLoading) return;

    // If the user is not signed in, redirect them to the sign up page
    if(!user) {
      router.replace("/");
    }

    setAuthLoading(false);

  }, [userLoading])

  return (
    <>
      { userLoading || authLoading ? (
        <Backdrop
          open={true}
        >
          <CircularProgress />
        </Backdrop>
      ) : (
        <>{children}</>
      )}
    </>
  )
}

export default ProtectedPage
