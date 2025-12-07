import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_MESSAGES_ROUTE } from "@/utils/constants";
import moment from "moment";
import React, { useRef, useEffect } from "react";
import { FaFile, FaDownload } from "react-icons/fa6";

const MessageContainer = () => {
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages,
  } = useAppStore();

  const checkIfImage = (file) => {
    const imgRegex = /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i;
    return imgRegex.test(file);
  };

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate != lastDate;
      lastDate = messageDate;
      return (
        <div key={message._id}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
        </div>
      );
    });
  };

  const renderDMMessages = (message) => (
    <div
      className={`${
        message.sender !== selectedChatData._id ? "text-right" : "text-left"
      }`}
    >
      {message.type === "text" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-purple-700 text-purple-300 border-purple-900/50 rounded-bl-2xl"
              : "bg-zinc-700 text-zinc-300 border-zinc-900/50 rounded-br-2xl"
          } border inline-block px-4 py-2 rounded-t-2xl my-1 max-w-[50%] wrap-break-word`}
        >
          {message.content}
        </div>
      )}

      {message.type === "file" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-purple-700 text-purple-300 border-purple-900/50 rounded-bl-2xl"
              : "bg-zinc-700 text-zinc-300 border-zinc-900/50 rounded-br-2xl"
          } border inline-block px-4 py-2 rounded-t-2xl my-1 max-w-[50%] wrap-break-word`}
        >
          {checkIfImage(message.fileUrl) ? (
            <div className="cursor-pointer">
              <img src={message.fileUrl} className="w-full" />
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-xl rounded-full p-2 bg-white/30">
                <FaFile />
              </span>
              <span className=" p-2">{message.fileUrl.split("/").pop()}</span>
              <span className=" cursor-pointer text-xl rounded-full p-2 bg-white/30 hover:bg-white/40">
                <FaDownload />
              </span>
            </div>
          )}
        </div>
      )}
      <div className="text-xs text-zinc-500">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );

  const getAllMessagesContact = async () => {
    await apiClient
      .post(
        GET_MESSAGES_ROUTE,
        { id: selectedChatData._id },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          setSelectedChatMessages(res.data.messages);
        }
      })
      .catch((err) => {
        const msg = err.response?.data;
        toast.error(msg);
      });
  };

  useEffect(() => {
    getAllMessagesContact();
  }, [selectedChatData]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8">
      {renderMessages()}
      <div ref={scrollRef}></div>
    </div>
  );
};

export default MessageContainer;
