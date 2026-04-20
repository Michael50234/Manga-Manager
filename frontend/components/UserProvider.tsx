'use client';

import { User } from '../types'
import React, { useContext, createContext, useState, useEffect } from 'react'

type UserContext = {
    user: User | null,
    loadUser: () => void,
    setUser: React.Dispatch<React.SetStateAction<User | null>>
};

const UserContext = createContext<UserContext | null>(null);

export const useUser = () => {
  const userContext = useContext(UserContext);

  if(!userContext) {
    throw new Error("useUser can only be used within the userProvider")
  }
}

const UserProvider = ({ children }: {children: React.ReactNode}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState<boolean>(true);

  const loadUser = async () => {
    setUserLoading(true);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE__URL}/accounts`);

    // This case occurs when the JWT token is expired/invalid or when the user does not have a JWT cookie
    if(!response.ok) {
      return;
    };

    const data = await response.json();
    setUser(data);
    setUserLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      loadUser, 
    }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider
