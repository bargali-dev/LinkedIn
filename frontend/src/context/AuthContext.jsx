import React, { createContext } from 'react'

export const authDataContext = createContext();
const serverUrl = 'https://linkedin-backend-tpca.onrender.com'
const AuthContext = ({children}) => {
  let value = {
  serverUrl
  }
  return (
    <div>
      <authDataContext.Provider value={value}>{children}</authDataContext.Provider>
    </div>
  );
}

export default AuthContext
