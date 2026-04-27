import React, { useContext, useEffect, useState } from 'react'
import { FaRegCommentDots } from "react-icons/fa6";
import profile from "../assets/Images/profile.png";
import { BiLike, BiSolidLike} from "react-icons/bi"
import {LuSendHorizontal} from "react-icons/lu";
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';
import { socket, userDataContext } from '../context/UserContext';
import moment from "moment";            // first install-> npm install moment
import ConnectionButton from './ConnectionButton';

const Post = ({id,author, like ,comment,description,image,createdAt}) => {
  let [more,setMore] = useState(false)
  let [likes,setLikes] = useState(like || [])
  let {serverUrl} = useContext(authDataContext);
  let {getPost,userData,setUserData,handleGetProfile} = useContext(userDataContext);
  let [commentContent,setCommentContent] = useState("")
  let [comments,setComments] = useState([])
  let [showComment,setShowComment] = useState(false)
const handleLike = async()=>{
  try {
    let result = await axios.get(serverUrl+`/api/post/like/${id}`,{withCredentials:true})
    console.log(result)
    setLikes(result.data.likes)
  } catch (error) {
    console.log(error)
  }
}
const handleComment =async(e)=>{
  e.preventDefault()
  try {
    let result = await axios.post(serverUrl+`/api/post/comment/${id}`,{content:commentContent},{withCredentials:true})
    console.log("API response:", result.data);
    setComments(result.data.comment)
    setCommentContent("")
  } catch (error) {
    console.log(error)
  }
}

useEffect(()=>{
  socket.on("likeUpdated",({postId,likes})=>{
    if(postId==id){
      setLikes(likes)
    }
  })

  socket.on("commentAdded", ({ postId, comm }) => {
    if (postId == id) {
      setComments(comm);
      console.log("Socket comment:", comm);
    }
  });
  return ()=>{
    socket.off("likeUpdated")
    socket.off("commentAdded");
  }
},[id])

useEffect(()=>{
  setLikes(like)
  setComments(comment)
},[like,comment])

  return (
    <div className="w-full min-h-[200px] flex flex-col gap-[10px] bg-white rounded-lg shadow-lg p-[20px]">
      <div className="flex justify-between items-center">
        <div
          className="flex justify-center items-start gap-[10px]"
          onClick={() => handleGetProfile(author.userName)}
        >
          <div className="w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center  cursor-pointer">
            <img
              src={author?.profileImage || profile}
              alt=""
              className=" h-full "
            ></img>
          </div>
          <div>
            <div className="text-[22px] font-semibold">
              {`${author?.firstName} ${author?.lastName}`}
            </div>
            <div className="text-[16px]">{`${author?.headline}`}</div>
            <div className="text-[16px]">{moment(createdAt).fromNow()}</div>
          </div>
        </div>
        {userData?._id != author?._id && (
          <div>
            <ConnectionButton userId={author?._id} />
          </div>
        )}
      </div>
      <div
        className={`w-full pl-[50px] ${!more ? "max-h-[100px]  overflow-hidden" : ""} `}
      >
        {description}
      </div>
      <div
        className="pl-[50px] text-[19px] font-semibold cursor-pointer"
        onClick={() => setMore((prev) => !prev)}
      >
        {more ? "read less..." : "read more..."}
      </div>
      {image && (
        <div className="w-full h-[300px] overflow-hidden flex justify-center rounded-lg">
          {" "}
          <img src={image} alt="" className="h-full rounded-lg" />{" "}
        </div>
      )}

      <div>
        <div className="w-full flex justify-between items-center p-[20px] border-b-2 ">
          <div className="flex items-center justify-center gap-[5px] text-[18px] ">
            <BiLike className="text-[#07a4ff] w-[20px] h-[20px] " />
            <span>{likes?.length}</span>
          </div>
          <div
            className="flex items-center justify-center gap-[5px] text-[18px] cursor-pointer"
            onClick={() => setShowComment((prev) => !prev)}
          >
            <span>
              {comments?.length}
              <span>comments</span>
            </span>
          </div>
        </div>

        <div className="flex justify-start items-center w-full p-[20px] gap-[20px]">
          {!likes?.includes(userData?._id) && (
            <div
              className="flex justify-center items-center gap-[5px] cursor-pointer"
              onClick={handleLike}
            >
              {" "}
              <BiLike className="w-[24px] h-[24px] " />
              <span>Like</span>
            </div>
          )}
          {likes?.includes(userData?._id) && (
            <div
              className="flex justify-center items-center gap-[5px] cursor-pointer"
              onClick={handleLike}
            >
              {" "}
              <BiSolidLike className="w-[24px] h-[24px] text-[#07a4ff]" />
              <span className="text-[#07a4ff]">Liked</span>
            </div>
          )}
          <div
            className="flex justify-center items-center gap-[5px] cursor-pointer"
            onClick={() => setShowComment((prev) => !prev)}
          >
            <FaRegCommentDots className="w-[24px] h-[24px]" />
            <span>Comments</span>
          </div>
        </div>
        {showComment && (
          <div>
            <form
              className="w-full flex justify-between items-center border-2 border-b-gray-300 p-[10px]"
              onSubmit={handleComment}
            >
              <input
                type="text"
                placeholder={"leave a comment"}
                className="outline-none border-none "
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
              />
              <button>
                <LuSendHorizontal className="text-[#07a4ff] w-[22px] h-[22px]" />
              </button>
            </form>
            <div className="flex flex-col gap-[10px] ">
              
              {comments?.map((com) => (
                <div
                  key={com?._id}
                  className="flex flex-col gap-[10px] border-2 p-[20px] border-b-gray-300"
                >
                  <div className="w-full flex justify-start items-center gap-[10px]">
                    <div className="w-[40px] h-[40px] rounded-full overflow-hidden flex items-center justify-center cursor-pointer">
                      <img
                        src={com?.user?.profileImage || profile}
                        alt=""
                        className="h-full"
                      />
                    </div>
                    <div>
                      {com?.user?.firstName} {com?.user?.lastName}
                    </div>
                  </div>
                  <div className="pl-[50px]">{com?.content}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Post
