import React from "react";

const OnlineIndicator = ({ active = false, size }) => {
  return (
    <div
      className={`absolute bottom-0.5 right-0.5 h-${size} w-${size} outline-2 rounded-full ${
        active
          ? "bg-green-500 outline-purple-800"
          : "bg-green-500  outline-zinc-100 dark:outline-zinc-900"
      } `}
    ></div>
  );
};

export default OnlineIndicator;
