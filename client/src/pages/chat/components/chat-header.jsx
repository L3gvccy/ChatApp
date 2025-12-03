import React from "react";
import { IoClose } from "react-icons/io5";

const ChatHeader = () => {
  return (
    <div className="flex items-center justify-between h-[10vh] border-b-2 border-zinc-800 px-20">
      <div className="flex gap-5 items-center">
        <div className="flex gap-3 items-center justify-center"></div>
        <button className="text-zinc-500 focus:text-zinc-100 transition-all duration-300 text-3xl cursor-pointer">
          <IoClose />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
