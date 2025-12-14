import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import React, { useState } from "react";
import { IoPersonRemove, IoTrash } from "react-icons/io5";
import ConfirmAction from "./confirm-action";
import { useSocket } from "@/context/SocketContext";

const ChannelMember = (props) => {
  const { isOwner, member, ownerId } = props;
  const { selectedChatData } = useAppStore();
  const socket = useSocket();

  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleRemoveMember = () => {
    socket.emit("removeChannelMember", selectedChatData._id, member._id);
  };

  return (
    <>
      <div
        className="flex gap-2 items-center justify-center w-full p-3 border-b-2 border-zinc-500"
        key={member._id}
      >
        <Avatar className="h-8 w-8 rounded-full overflow-hidden ">
          {member.image ? (
            <AvatarImage
              src={member.image}
              alt="Фото профілю"
              className="object-cover w-full h-full bg-black"
            />
          ) : (
            <div
              className={`uppercase h-8 w-8 text-2xl rounded-full flex justify-center items-center ${getColor(
                member.color
              )}`}
            >
              {member.firstName
                ? member.firstName.split("").shift()
                : member.email.split("").shift()}
            </div>
          )}
        </Avatar>
        <div className="flex flex-1 justify-between items-center">
          <div className="text-zinc-100">
            {`${member.firstName} ${member.lastName}`}
          </div>
          {ownerId === member._id && (
            <div className="text-zinc-500 text-sm">Власник</div>
          )}

          {ownerId !== member._id && isOwner && (
            <button
              className="text-zinc-500 hover:text-red-500 transition-all duration-300 cursor-pointer"
              onClick={() => {
                setConfirmOpen(true);
              }}
            >
              <IoPersonRemove />
            </button>
          )}
        </div>
      </div>
      <ConfirmAction
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onConfirm={() => handleRemoveMember()}
        text={`Ви впевнені, що хочете видалити учасника ${member.firstName} ${member.lastName} з каналу?`}
      />
    </>
  );
};

export default ChannelMember;
