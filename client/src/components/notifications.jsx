import React, { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { Avatar, AvatarImage } from "./ui/avatar";
import { getColor } from "@/lib/utils";

const Notifications = ({ notifications, remove }) => {
  return (
    <div className="fixed top-4 md:top-auto md:bottom-4 right-4 z-20 space-y-2">
      {notifications.map((message) => (
        <Notification message={message} remove={remove} key={message._id} />
      ))}
    </div>
  );
};

const Notification = ({ message, remove }) => {
  const audioRef = useRef();
  const handleNotificationClick = (message) => {
    if (message.reciever) {
    } else if (message.channel) {
    }
  };

  useEffect(() => {
    audioRef.current.volume = "0.33";
  }, []);

  return (
    <>
      <div className="grid gap-2 rounded-md w-[90vw] max-w-[360px] p-3 border shadow-md border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 cursor-pointer">
        <div className="grid grid-cols-[auto_1fr_auto] gap-2">
          {message.reciever ? (
            <Avatar className="h-8 w-8 rounded-full overflow-hidden relative">
              {message.reciever.image ? (
                <AvatarImage
                  src={message.reciever.image}
                  alt="Фото профілю"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-8 w-8 text-lg rounded-full flex justify-center items-center ${getColor(
                    message.reciever.color
                  )}`}
                >
                  {message.reciever.firstName
                    ? message.reciever.firstName.split("").shift()
                    : message.reciever.email.split("").shift()}
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
              ? `${message.reciever.firstName} ${message.reciever.lastName}`
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
        <div>{message.content ? message.content : "1 Файл"}</div>
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
