import React from "react";
import ChatHeader from "./chat-header";
import MessageContainer from "./message-container";
import MessageBar from "./message-bar";

const ChatContainer = () => {
  return (
    <div className="fixed top-0 h-screen w-screen bg-white dark:bg-zinc-900 flex flex-col md:static md:flex-1">
      <ChatHeader />
      <MessageContainer />
      <MessageBar />
    </div>
  );
};

export default ChatContainer;
