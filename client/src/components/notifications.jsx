import React, { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { Avatar, AvatarImage } from "./ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";

const Notifications = ({ notifications, remove, removeChatNotifications }) => {
  return (
    <div className="fixed top-4 md:top-auto md:bottom-4 right-4 z-20 space-y-2">
      {notifications.map((message) => (
        <Notification
          message={message}
          remove={remove}
          key={message._id}
          removeChatNotifications={removeChatNotifications}
        />
      ))}
    </div>
  );
};

const Notification = ({ message, remove, removeChatNotifications }) => {
  const audioRef = useRef();
  const { setSelectedChatType, setSelectedChatData } = useAppStore();
  const handleNotificationClick = (message) => {
    console.log(message);
    if (message.reciever) {
      setSelectedChatType("contact");
      setSelectedChatData(message.sender);
    } else if (message.channel) {
      setSelectedChatType("contact");
      setSelectedChatData(message.channel);
    }

    removeChatNotifications(message);
  };

  useEffect(() => {
    audioRef.current.volume = "0.33";
  }, []);

  return (
    <>
      <div
        className="grid gap-2 rounded-md w-[90vw] max-w-[360px] p-3 border shadow-md border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 cursor-pointer"
        onClick={() => {
          handleNotificationClick(message);
        }}
      >
        <div className="grid grid-cols-[auto_1fr_auto] gap-2">
          {message.reciever ? (
            <Avatar className="h-8 w-8 rounded-full overflow-hidden relative">
              {message.sender.image ? (
                <AvatarImage
                  src={message.sender.image}
                  alt="Фото профілю"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-8 w-8 text-lg rounded-full flex justify-center items-center ${getColor(
                    message.sender.color
                  )}`}
                >
                  {message.sender.firstName
                    ? message.sender.firstName.split("").shift()
                    : message.sender.email.split("").shift()}
                </div>
              )}
            </Avatar>
          ) : (
            <Avatar className="h-8 w-8 rounded-full overflow-hidden ">
              {message.channel.image ? (
                <AvatarImage
                  src={message.channel.image}
                  alt="Фото профілю"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-8 w-8 text-lg rounded-full flex justify-center items-center ${getColor(
                    message.channel.color
                  )}`}
                >
                  {message.channel.name.split("").shift()}
                </div>
              )}
            </Avatar>
          )}

          <div className="grid items-center truncate font-semibold">
            {message.reciever
              ? `${message.sender.firstName} ${message.sender.lastName}`
              : `${message.channel.name}`}
          </div>
          <div
            className="text-md cursor-pointer opacity-75 hover:opacity-100 transition-all duration-300"
            onClick={() => {
              remove(message._id.toString());
            }}
          >
            <IoClose />
          </div>
        </div>
        <div className="truncate">
          {message.content ? message.content : "1 Файл"}
        </div>
      </div>
      <audio
        ref={audioRef}
        src="/notification.mp3"
        className="display-none"
        autoPlay
      />
    </>
  );
};

export default Notifications;
