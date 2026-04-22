'use client';

import { User } from '../types'
import React, { useContext, createContext, useState, useEffect } from 'react'

type UserContext = {
    user: User | null,
    loadUser: () => Promise<void>,
    setUser: React.Dispatch<React.SetStateAction<User | null>>,
    userLoading: boolean
};

const UserContext = createContext<UserContext | null>(null);

export const useUser = () => {
  const userContext = useContext(UserContext);

  if(!userContext) {
    throw new Error("useUser can only be used within the userProvider")
  }

  return userContext
}

const UserProvider = ({ children }: {children: React.ReactNode}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState<boolean>(true);

  const loadUser = async () => {
    try {
      setUserLoading(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts`, {
        method: "GET",
        credentials: "include",
      });

      // This case occurs when the JWT token is expired/invalid or when the user does not have a JWT cookie
      if(!response.ok) {
        throw new Error("Failed to fetch user")
      };

      // If no error is thrown, take the response body and assign it to the user state
      const data = await response.json();

      setUser(data);
    } catch {
      // If we fail to fetch the user, treat them as loggeed out to avoid stale data problems
      setUser(null);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      loadUser, 
      userLoading,
    }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
