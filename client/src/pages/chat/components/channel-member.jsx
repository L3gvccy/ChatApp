import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import React from "react";
import { IoPersonRemove, IoTrash } from "react-icons/io5";

const ChannelMember = (props) => {
  const { isOwner, member, ownerId } = props;
  return (
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
          <button className="text-zinc-500 hover:text-red-500 transition-all duration-300 cursor-pointer">
            <IoPersonRemove />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChannelMember;
