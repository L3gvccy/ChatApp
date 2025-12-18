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
import { apiClient } from "@/lib/api-client";
import { LOGOUT_ROUTE } from "@/utils/constants";
import { toast } from "sonner";

const ProfileInfo = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const fullName = `${userInfo.firstName} ${userInfo.lastName}`;
  const selectedColor = userInfo.color;
  const image = userInfo?.image || null;

  const handleLogout = async () => {
    await apiClient
      .post(LOGOUT_ROUTE, {}, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          const msg = res.data;
          toast.success(msg);
          setUserInfo(null);
        }
      })
      .catch((err) => {
        const msg = err.response?.data;
        toast.error(msg);
      })
      .finally(() => {
        navigate("/auth");
      });
  };

  return (
    <div className="absolute bottom-0 p-4 w-full bg-purple-200 dark:bg-zinc-800 rounded-t-xl flex items-center justify-between">
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
              className={`uppercase h-8 w-8 text-lg rounded-full flex justify-center items-center ${getColor(
                selectedColor
              )}`}
            >
              {fullName
                ? fullName.split("").shift()
                : userInfo.email.split("").shift()}
            </div>
          )}
        </Avatar>
        <div className="grid w-full items-center text-sm text-zinc-900 dark:text-zinc-100">
          <div className="truncate">{fullName}</div>
        </div>
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
          <TooltipTrigger className="cursor-pointer" onClick={handleLogout}>
            <IoLogOutOutline />
          </TooltipTrigger>
          <TooltipContent>Вийти</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default ProfileInfo;
