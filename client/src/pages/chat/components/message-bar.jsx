import React, { useRef } from "react";
import { useState, useEffect } from "react";
import { IoAttach, IoSend } from "react-icons/io5";
import { RiEmojiStickerLine, RiSendPlaneFill } from "react-icons/ri";
import { MdSend } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import { useSocket } from "@/context/SocketContext";
import { useAppStore } from "@/store";

const MessageBar = () => {
  const emojiRef = useRef();
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
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        sender: userInfo._id,
        content: message,
        reciever: selectedChatData._id,
        type: "text",
        fileUrl: undefined,
      });
    }
    setMessage("");
  };

  return (
    <div className="h-[10vh] bg-zinc-900 flex justify-center items-center px-8 mb-3 gap-5">
      <div className="flex-1 flex bg-zinc-800 rounded-full items-center gap-5 pr-5">
        <input
          type="text"
          placeholder="Введіть повідомлення"
          className="flex-1 px-5 py-3 bg-transparent rounded-full focus:border-none focus:outline-none"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <button className="text-2xl text-zinc-500 focus:text-zinc-100 transition-all duration-300 cursor-pointer">
          <IoAttach />
        </button>
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
