import React, { useContext, createContext } from 'react'

type UserContext = {
    user: User,
    loadUser: () => void,
    setUser: React.Dispatch<React.SetStateAction<User>>
}

const userContext = createContext<>(null)

const UserProvider = () => {
  return (
    <div>
      
    </div>
  )
}

export default UserProvider
