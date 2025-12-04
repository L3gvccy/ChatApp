import { useAppStore } from "@/store";
import moment from "moment";
import React, { useRef, useEffect } from "react";

const MessageContainer = () => {
  const scrollRef = useRef();
  const { selectedChatType, selectedChatData, userInfo, selectedChatMessages } =
    useAppStore();

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
      <div className="text-xs text-zinc-500">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );

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
