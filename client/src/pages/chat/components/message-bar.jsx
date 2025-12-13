import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { IoAttach, IoSend } from "react-icons/io5";
import { RiEmojiStickerLine, RiSendPlaneFill } from "react-icons/ri";
import { MdSend } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import { useSocket } from "@/context/SocketContext";
import { useAppStore } from "@/store";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";
import { ClimbingBoxLoader } from "react-spinners";

const MessageBar = () => {
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const socket = useSocket();
  const { selectedChatType, selectedChatData, userInfo } = useAppStore();
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  const handleAddEmoji = (emoji) => {
    setMessage(message + emoji.emoji);
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setEmojiPickerOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleSendMessage = async () => {
    if (message.length > 0) {
      if (selectedChatType === "contact") {
        socket.emit("sendMessage", {
          sender: userInfo._id,
          content: message,
          reciever: selectedChatData._id,
          type: "text",
          fileUrl: undefined,
        });
      } else if (selectedChatType === "channel") {
        socket.emit("sendChannelMessage", {
          sender: userInfo._id,
          content: message,
          channel: selectedChatData._id,
          type: "text",
          fileUrl: undefined,
        });
      }
      setMessage("");
    } else return;
  };

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    console.log(file);

    if (file) {
      let formData = new FormData();
      formData.append("file", file);
      await apiClient
        .post(UPLOAD_FILE_ROUTE, formData, {
          withCredentials: true,
        })
        .then((res) => {
          if (res.status === 200 && res.data) {
            if (selectedChatType === "contact") {
              socket.emit("sendMessage", {
                sender: userInfo._id,
                content: undefined,
                reciever: selectedChatData._id,
                type: "file",
                fileUrl: res.data.fileUrl,
              });
            } else if (selectedChatType === "channel") {
              socket.emit("sendChannelMessage", {
                sender: userInfo._id,
                content: undefined,
                channel: selectedChatData._id,
                type: "file",
                fileUrl: res.data.fileUrl,
              });
            }
          }
        })
        .catch((err) => {
          const msg = err.response?.data;
          toast.error(msg);
        });
    }
  };

  return (
    <div className="h-[10vh] bg-zinc-900 flex justify-center items-center px-8 mb-3 gap-2 md:gap-5">
      <div className="flex-1 flex bg-zinc-800 rounded-full items-center gap-1 md:gap-5 pr-5">
        <input
          type="text"
          placeholder="Введіть повідомлення"
          className="flex-1 px-5 py-3 pr-0 bg-transparent rounded-full focus:border-none focus:outline-none"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <button
          className="text-2xl text-zinc-500 focus:text-zinc-100 transition-all duration-300 cursor-pointer"
          onClick={handleFileClick}
        >
          <IoAttach />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            handleFileChange(e);
          }}
        />
        <div className="relative">
          <div className="flex items-center">
            <button
              className=" my-auto text-2xl text-zinc-500 focus:text-zinc-100 transition-all duration-300 cursor-pointer"
              onClick={() => {
                setEmojiPickerOpen((prev) => !prev);
              }}
            >
              <RiEmojiStickerLine />
            </button>
          </div>
          <div ref={emojiRef} className="absolute right-0 bottom-12">
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>

      <button
        className="text-xl rounded-full p-3 bg-purple-700 hover:bg-purple-600 active:bg-purple-800 cursor-pointer"
        onClick={handleSendMessage}
      >
        <MdSend />
      </button>
    </div>
  );
};

export default MessageBar;
