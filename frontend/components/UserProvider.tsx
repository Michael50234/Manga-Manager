import { User } from '../types'
import React, { useContext, createContext } from 'react'

type UserContext = {
    user: User,
    loadUser: () => void,
    setUser: React.Dispatch<React.SetStateAction<User>>
};

const UserContext = createContext<UserContext | null>(null);

const UserProvider = ({ children }: {children: React.ReactNode}) => {
  const loadUser = () => {

  }

  return (
    <>
    {children}
    </>
  )
}

export default UserProvider
