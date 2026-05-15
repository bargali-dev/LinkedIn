import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { authDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";

const socket = io("https://linkedin-backend-tpca.onrender.com");

const ConnectionButton = ({ userId }) => {
  const { serverUrl } = useContext(authDataContext);
  const { userData } = useContext(userDataContext);

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ===========================
  // GET CONNECTION STATUS
  // ===========================
  const getStatus = async () => {
    if (!userId) return;

    try {
      const res = await axios.get(
        `${serverUrl}/api/connection/getstatus/${userId}`,
        { withCredentials: true },
      );

      setStatus(res.data.status);
    } catch (error) {
      console.log(error);
    }
  };

  // ===========================
  // SEND CONNECTION
  // ===========================
  const sendConnection = async () => {
    try {
      setLoading(true);

      await axios.post(
        `${serverUrl}/api/connection/send/${userId}`,
        {},
        { withCredentials: true },
      );

      setStatus("pending"); // update instantly
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // REMOVE CONNECTION
  // ===========================
  const removeConnection = async () => {
    try {
      setLoading(true);

      await axios.delete(`${serverUrl}/api/connection/remove/${userId}`, {
        withCredentials: true,
      });

      setStatus("Connect"); // reset instantly
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // BUTTON CLICK
  // ===========================
  const handleClick = async () => {
    if (loading) return;

    if (status === "disconnect") {
      await removeConnection();
    } else if (status === "received") {
      navigate("/network");
    } else if (status === "Connect") {
      await sendConnection();
    }
  };

  // ===========================
  // SOCKET + INITIAL STATUS
  // ===========================
  useEffect(() => {
    if (!userId || !userData?._id) return;

    socket.emit("register", userData._id);
    getStatus();

    socket.on("statusUpdate", ({ updateUserId, newStatus }) => {
      if (updateUserId === userId) {
        setStatus(newStatus);
      }
    });

    return () => {
      socket.off("statusUpdate");
    };
  }, [userId, userData]);

  return (
    <button
      className="min-w-[110px] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] font-medium"
      disabled={loading || status === "pending"}
      onClick={handleClick}
    >
      {loading ? "Loading..." : status}
    </button>
  );
};

export default ConnectionButton;
