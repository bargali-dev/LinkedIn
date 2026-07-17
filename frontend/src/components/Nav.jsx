import React, { useContext, useEffect, useState } from "react";

import logo2 from "../assets/Images/logo2.png";
import profile from "../assets/Images/profile.png";
import { IoSearchSharp } from "react-icons/io5";
import { TiHome } from "react-icons/ti";
import { FaUserGroup } from "react-icons/fa6";
import { IoNotificationsSharp } from "react-icons/io5";
import { userDataContext } from "../context/UserContext";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Nav = () => {
  let [activeSearch , setActiveSearch] = useState(false)
  let {userData, setUserData ,handleGetProfile} = useContext(userDataContext)
  let {serverUrl} = useContext(authDataContext);
  let [popUp , setPopUp] = useState(false);
  let [searchInput,setSearchInput] = useState("")
  let [searchData , setSearchData] = useState([])
  let navigate = useNavigate();
  const handleSignOut = async()=>{
    try {
      let result = await axios.get(serverUrl+"/api/auth/logout",{withCredentials:true})
      setUserData(null);
      navigate("/login");  
    } catch (error) {
      console.log(error)
    }
  }
 const handleSearch = async () => {
   try {
     if (!searchInput.trim()) {
       setSearchData([]); 
       return;
     }

     let result = await axios.get(
       `${serverUrl}/api/user/search?query=${searchInput}`,
       { withCredentials: true },
     );

     setSearchData(result.data);
     console.log(searchData);
   } catch (error) {
     console.log(error);
     setSearchData([]);
   }
 };
useEffect(() => {
  if (!searchInput.trim()) {
    setSearchData([]);
    return;
  }

  handleSearch();
}, [searchInput]);
  return (
    <div className="w-full h-[80px] bg-[white] fixed top-0 justify-between shadow-lg flex md:justify-around items-center px-[10px] z-[100] ">
      <div className="flex items-center justify-center gap-[10px] ">
        <div onClick={() => setActiveSearch((prev) => !prev)}>
          <img
            src={logo2}
            alt=""
            className="w-[50px]"
            onClick={() => navigate("/")}
          />
        </div>
        {!activeSearch && (
          <div className=" ">
            <IoSearchSharp
              className="w-[23px] h-[23px] text-gray-600 lg:hidden"
              onClick={() => setActiveSearch((prev) => !prev)}
            />
          </div>
        )}
       {searchData.length > 0 && (
  <div className="absolute top-[90px] h-[500px] min-h-[100px] left-[0px] lg:left-[20px] bg-white shadow-lg w-[100%] lg:w-[700px] flex flex-col gap-[20px] p-[20px] overflow-auto">
    {searchData.map((search) => {
      return (
        <div
          key={search._id}
          className="flex gap-[20px] items-center border-b-2 border-b-gray-300 p-[10px] hover:bg-gray-200 cursor-pointer rounded-lg"
          onClick={() => handleGetProfile(search.userName)}
        >
          <div className="w-[70px] h-[70px] rounded-full overflow-hidden">
            <img
              src={search.profileImage || profile}
              alt=""
              className="w-full h-full"
            />
          </div>

          <div>
            <div className="text-[19px] font-semibold text-gray-700">
              {`${search.firstName} ${search.lastName}`}
            </div>

            <div className="text-[15px] font-semibold text-gray-700">
              {search.headline}
            </div>
          </div>
        </div>
      );
    })}
  </div>
)}
        <form
          className={`w-[250px] lg:w-[350px] h-[40px] bg-[#fcf9e7] lg:flex items-center gap-[10px] px-[10px] py-[5px] rounded-md ${!activeSearch ? "hidden" : "flex "} `}
        >
          <div>
            <IoSearchSharp className="w-[23px] h-[23px] text-gray-600 " />
          </div>
          <input
            type="text"
            placeholder="search users..."
            className="w-[80%] h-full bg-transparent outline-none border-0"
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
          />
        </form>
      </div>

      <div className="flex items-center justify-center gap-[20px] ">
        {popUp && (
          <div className="w-[300px] min-h-[300px] bg-white shadow-lg absolute top-[75px] rounded-lg flex flex-col items-center p-[20px] gap-[20px] right-[20px] lg:right-[100px]">
            <div className="w-[70px] h-[70px] rounded-full overflow-hidden">
              <img
                src={userData.profileImage || profile}
                alt=""
                className="w-full h-full"
              ></img>
            </div>
            <div className="text-[19px] font-semibold text-gray-700">
              {`${userData.firstName} ${userData.lastName}`}
            </div>
            <button
              className="w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]"
              onClick={() => handleGetProfile(userData.userName)}
            >
              View profile
            </button>
            <div className="w-full h-[1px] bg-gray-700"></div>
            <div
              className="w-full flex items-center justify-start  text-gray-600 gap-[10px]"
              onClick={() => navigate("/network")}
            >
              <FaUserGroup className="w-[23px] h-[23px] text-gray-600" />
              <div>My Networks</div>
            </div>
            <button
              className="w-[100%] h-[40px] rounded-full border-2 border-[#ec4545] text-[#ec4545]"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        )}
        <div
          className="flex items-center justify-center flex-col text-gray-600  cursor-pointer"
          onClick={() => navigate("/")}
        >
          <TiHome className="w-[23px] h-[23px] text-gray-600" />
          <div className="md:block hidden  ">Home</div>
        </div>
        <div
          className="flex items-center justify-center flex-col text-gray-600  cursor-pointer"
          onClick={() => navigate("/network")}
        >
          <FaUserGroup className="w-[23px] h-[23px] text-gray-600" />
          <div className="md:block hidden ">My Networks</div>
        </div>
        <div
          className="flex items-center justify-center flex-col text-gray-600  cursor-pointer"
          onClick={() => navigate("/notification")}
        >
          <IoNotificationsSharp className="w-[23px] h-[23px] text-gray-600" />
          <div className="md:block hidden  ">Notifications</div>
        </div>
        <div
          className="w-[50px] h-[50px] rounded-full overflow-hidden cursor-pointer"
          onClick={() => setPopUp((prev) => !prev)}
        >
          <img
            src={userData.profileImage || profile}
            alt=""
            className="w-full h-full "
          ></img>
        </div>
      </div>
    </div>
  );
};

export default Nav;
