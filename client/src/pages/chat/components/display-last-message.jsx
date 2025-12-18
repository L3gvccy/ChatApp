import React from "react";

const DisplayLastMessage = ({ chatType, message, isSelected }) => {
  return (
    <div
      className={`text-sm h-6 truncate  ${
        isSelected ? "text-zinc-200" : "text-zinc-700 dark:text-zinc-300"
      }`}
    >
      {chatType === "channel" && (
        <span className="font-semibold">{`${message.sender.firstName}: `}</span>
      )}
      {`${message.type === "text" ? `${message.content}` : `1 Файл`}`}
    </div>
  );
};

export default DisplayLastMessage;
