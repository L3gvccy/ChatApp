import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import React from "react";
import { IoClose } from "react-icons/io5";

const ChatHeader = () => {
  const { selectedChatData, closeChat } = useAppStore();
  console.log(selectedChatData);
  return (
    <div className="flex items-center justify-between h-[10vh] border-b-2 border-zinc-800 px-20">
      <div className="flex w-full items-center justify-between">
        <div className="flex gap-3 items-center justify-center">
          <Avatar className="h-10 w-10 rounded-full overflow-hidden ">
            {selectedChatData.image ? (
              <AvatarImage
                src={selectedChatData.image}
                alt="Фото профілю"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div
                className={`uppercase h-10 w-10 text-2xl rounded-full flex justify-center items-center ${getColor(
                  selectedChatData.color
                )}`}
              >
                {selectedChatData.firstName
                  ? selectedChatData.firstName.split("").shift()
                  : selectedChatData.email.split("").shift()}
              </div>
            )}
          </Avatar>

          <div>
            {selectedChatData.firstName
              ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
              : selectedChatData.email}
          </div>
        </div>
        <button
          className="text-zinc-500 focus:text-zinc-100 transition-all duration-300 text-3xl cursor-pointer"
          onClick={closeChat}
        >
          <IoClose />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
