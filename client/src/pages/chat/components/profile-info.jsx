import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { IoLogOutOutline, IoPencil } from "react-icons/io5";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import React from "react";
import { useNavigate } from "react-router-dom";

const ProfileInfo = () => {
  const trimName = (name) => {
    let result;
    if (name.length >= 20) {
      result = name.slice(0, 20);
      result += "...";
      return result;
    } else {
      return name;
    }
  };
  const navigate = useNavigate();
  const { userInfo } = useAppStore();
  let fullName = trimName(`${userInfo.firstName} ${userInfo.lastName}`);
  const selectedColor = userInfo.color;
  const image = userInfo?.image || null;

  return (
    <div className="absolute bottom-0 p-4 w-full bg-zinc-800 rounded-t-xl flex items-center justify-between">
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 rounded-full overflow-hidden ">
          {image ? (
            <AvatarImage
              src={image}
              alt="Фото профілю"
              className="object-cover w-full h-full bg-black"
            />
          ) : (
            <div
              className={`uppercase h-8 w-8 text-xl rounded-full flex justify-center items-center ${getColor(
                selectedColor
              )}`}
            >
              {fullName
                ? fullName.split("").shift()
                : userInfo.email.split("").shift()}
            </div>
          )}
        </Avatar>
        <div className="flex items-center text-sm">{fullName}</div>
      </div>
      <div className="flex justify-between items-center gap-3 text-xl text-purple-700">
        <Tooltip>
          <TooltipTrigger
            className="cursor-pointer"
            onClick={() => {
              navigate("/profile");
            }}
          >
            <IoPencil />
          </TooltipTrigger>
          <TooltipContent>Редагувати профіль</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger className="cursor-pointer">
            <IoLogOutOutline />
          </TooltipTrigger>
          <TooltipContent>Вийти</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default ProfileInfo;
