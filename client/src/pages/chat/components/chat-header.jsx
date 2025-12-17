import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import React from "react";
import { IoClose } from "react-icons/io5";
import ChannelInfo from "./channel-info";
import dayjs from "dayjs";

const ChatHeader = () => {
  const { userInfo, selectedChatType, selectedChatData, closeChat } =
    useAppStore();
  return (
    <div className="flex items-center justify-between h-[10vh] border-b-2 border-purple-200 dark:border-zinc-800 px-8">
      <div className="flex w-full items-center justify-between">
        <div className="flex gap-3 items-center justify-center">
          <Avatar className="h-10 w-10 rounded-full overflow-hidden ">
            {selectedChatData.image ? (
              <AvatarImage
                src={selectedChatData.image}
                alt="Фото профілю"
                className="object-cover w-full h-full bg-black"
              />
            ) : selectedChatType === "channel" ? (
              <div
                className={`uppercase h-10 w-10 text-2xl rounded-full flex justify-center items-center ${getColor(
                  selectedChatData.color
                )}`}
              >
                {selectedChatData.name.split("").shift()}
              </div>
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

          {selectedChatType === "channel" ? (
            <div className="text-zinc-900 dark:text-zinc-200">
              {selectedChatData.name}
            </div>
          ) : (
            <div className="grid">
              <div className="text-zinc-900 dark:text-zinc-200 truncate">
                {selectedChatData.firstName
                  ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
                  : selectedChatData.email}
              </div>

              {selectedChatData.isOnline ? (
                <div className="text-sm text-purple-700 dark:text-purple-500 truncate">
                  В мережі
                </div>
              ) : (
                <div className="text-sm text-zinc-700 dark:text-zinc-500 truncate">
                  В мережі: {dayjs(selectedChatData.lastOnline).fromNow()}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex">
          {selectedChatType === "channel" && (
            <ChannelInfo
              isOwner={selectedChatData.owner._id === userInfo._id}
              data={selectedChatData}
            />
          )}
          <button
            className="text-zinc-500 focus:text-zinc-100 transition-all duration-300 text-3xl cursor-pointer"
            onClick={closeChat}
          >
            <IoClose />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
