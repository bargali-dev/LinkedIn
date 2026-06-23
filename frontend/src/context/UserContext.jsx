import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";

export let socket = io("https://backend-linkedin-pe2v.onrender.com");

export const userDataContext = createContext();
const UserContext = ({children}) => {
let [ userData,setUserData] = useState(null);
let { serverUrl} = useContext(authDataContext);
 let [edit, setEdit] = useState(false);
 let [postData,setPostData] = useState([]);
 let [profileData, setProfileData] = useState(null)
 let navigate = useNavigate();

const getCurrentUSer = async()=>{
  try {
    let result = await axios.get(serverUrl+"/api/user/currentuser",{withCredentials:true})
    setUserData(result.data)
  } 
  catch (error) {
    console.log(error)
    setUserData(null);
  }
}

const getPost = async()=>{
  try {
    let result = await axios.get(serverUrl+"/api/post/getpost",{withCredentials:true})
    setPostData(result.data)
  } catch (error) {
    console.log(error)
  }
}
const handleGetProfile = async(userName)=>{
    try {
      let result = await axios.get(`${serverUrl}/api/user/profile/${userName}`,{
        withCredentials: true,
      });
      console.log(result.data)
      setProfileData(result.data)
      navigate("/profile")
    } catch (error) {
      console.log(error)
    }
}

useEffect(() => {
  getCurrentUSer();
  getPost();
}, []);

const value = {
  userData,
  setUserData,
  edit,
  setEdit,
  postData,
  setPostData,
  profileData,
  setProfileData,
  getPost,
  handleGetProfile,
};
  return (
    <div>
      <userDataContext.Provider value={value}>{children}</userDataContext.Provider>
    </div>
  );
}

export default UserContext
