import React, { createContext } from 'react'

export const authDataContext = createContext();
const serverUrl = 'https://backend-linkedin-pe2v.onrender.com'
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
