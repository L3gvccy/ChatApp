import { getUnreadCount } from "@/lib/utils";
import React from "react";

const UnreadCount = ({ id }) => {
  const count = getUnreadCount(id);
  if (count > 0) {
    return (
      <div className="shrink-0">
        <div className="bg-purple-700 text-zinc-100 text-xs rounded-full w-6 h-6 flex items-center justify-center">
          {count > 9 ? "9+" : count}
        </div>
      </div>
    );
  }
};

export default UnreadCount;
