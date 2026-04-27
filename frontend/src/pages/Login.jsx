import React, { useContext, useState } from "react";
import linkedIn from "../assets/Images/linkedIn.png";
import { useNavigate } from "react-router-dom";
import { authDataContext } from "../context/AuthContext";
import axios from "axios";
import { userDataContext } from "../context/UserContext";
const Login = () => {
  let [show, setShow] = useState(false);
  let navigate = useNavigate();
  let { serverUrl } = useContext(authDataContext);
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState("");
  let {userData ,setUserData} = useContext(userDataContext);

  const handleSingnIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let result = await axios.post(
        serverUrl+"/api/auth/login",
        { email, password },
        { withCredentials: true },
      );
      console.log(result);
      setUserData(result.data);
      navigate("/")
      setLoading(false);
      
     
      setEmail("");
      setPassword("");
      setError("");
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-[white] flex items-center justify-start flex-col gap-[50px]">
      <div className="p-[30px] lg:p-[35px] w-full h-[80px] flex items-center  ">
        <img src={linkedIn} alt="" />
      </div>
      <form
        className="w-[90%] max-w-[400px] h-[500px] md:shadow-xl flex flex-col justify-center  gap-[10px] p-[15px] mt-[45px]"
        onSubmit={handleSingnIn}
      >
        <h1 className="text-gray-800 text-[30px] font-semibold mb-[30px] mt-[0px] ">
          Sign In
        </h1>
        
        <input
          type="email"
          placeholder="email"
          required
          className="w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] rounded-lg px-[20px] py-[10px]"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <div className="w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] rounded-lg relative ">
          <input
            type={show ? "text" : "password"}
            placeholder="password"
            required
            className="w-full h-full border-none border-gray-600 text-gray-800 text-[18px] rounded-lg px-[20px] py-[10px]"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <span
            className="absolute right-6 top-3 text-[#1dc9fd] cursor-pointer"
            onClick={() => setShow((prev) => !prev)}
          >
            {show ? "hidden" : "show"}
          </span>
        </div>
        {error && <p className="text-center text-red-500">*{error}</p>}
        <button
          className="w-[100%] h-[50px] rounded-full bg-[rgb(29,201,253)] mt-[30px] text-white "
          onClick={() => setLoading((prev) => !prev)}
        >
          {loading ? "loading..." : "Login"}
        </button>
        <p
          className="text-center cursor-pointer "
          onClick={() => {
            navigate("/signup");
          }}
        >
         want to create new account ?
          <span className="text-[#1dc9fd] ">Sign Up</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
