import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiClient } from "@/lib/api-client";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import {
  DELETE_CHANNEL_IMAGE,
  UPDATE_CHANNEL_NAME,
  UPLOAD_CHANNEL_IMAGE,
} from "@/utils/constants";
import React, { useRef, useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoAddOutline, IoPencil, IoTrash } from "react-icons/io5";
import { IoMdClose, IoMdCheckmark } from "react-icons/io";
import { toast } from "sonner";
import { useSocket } from "@/context/SocketContext";

const ChannelInfo = (props) => {
  const { isOwner } = props;
  const { selectedChatData, setSelectedChatData } = useAppStore();
  const socket = useSocket();
  const fileInputRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newChannelName, setNewChannelName] = useState(selectedChatData.name);
  const [modalOpen, setModalOpen] = useState(false);

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await apiClient
        .post(
          UPLOAD_CHANNEL_IMAGE,
          { image: file, channelId: selectedChatData._id },
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.status === 200) {
            toast.success(res.data.msg);
            socket.emit("updateChannel", res.data.channel);
          }
        })
        .catch((err) => {
          const msg = err.response?.data;
          toast.error(msg);
        });
    }
  };

  const handleImageDelete = async () => {
    await apiClient
      .post(
        DELETE_CHANNEL_IMAGE,
        { channelId: selectedChatData._id },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.msg);
          socket.emit("updateChannel", res.data.channel);
        }
      })
      .catch((err) => {
        const msg = err.response?.data;
        toast.error(msg);
      });
  };

  const handleChannelNameUpdate = async () => {
    if (newChannelName.trim().length === 0) {
      toast.error("Назва каналу не може бути порожньою");
      return;
    }
    await apiClient
      .post(
        UPDATE_CHANNEL_NAME,
        {
          channelId: selectedChatData._id,
          newName: newChannelName,
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.msg);
          socket.emit("updateChannel", res.data.channel);
          setEditingName(false);
        }
      })
      .catch((err) => {
        const msg = err.response?.data;
        toast.error(msg);
      });
  };

  return (
    <>
      <button
        className="text-zinc-500 focus:text-zinc-100 transition-all duration-300 text-2xl mr-5 cursor-pointer"
        onClick={() => {
          setModalOpen(true);
        }}
      >
        <HiOutlineDotsVertical />
      </button>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-zinc-900 border-0 text-zinc-100 w-[90vw] max-w-[400px] h-[80vh] flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle className="text-center">
              {isOwner ? "Налаштування каналу" : "Інформація про канал"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col justify-center items-center gap-2">
            <div
              className="h-24 w-24 relative"
              onMouseEnter={() => {
                setHovered(true);
              }}
              onMouseLeave={() => {
                setHovered(false);
              }}
            >
              <Avatar className="h-24 w-24 rounded-full overflow-hidden ">
                {selectedChatData.image ? (
                  <AvatarImage
                    src={selectedChatData.image}
                    alt="Фото профілю"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`uppercase h-24 w-24 text-5xl rounded-full flex justify-center items-center ${getColor(
                      selectedChatData.color
                    )}`}
                  >
                    {selectedChatData.name.split("").shift()}
                  </div>
                )}
              </Avatar>
              {isOwner && hovered && (
                <div
                  className="absolute inset-0 w-24 h-24 text-4xl text-gray-100 flex justify-center items-center bg-black/50 rounded-full cursor-pointer"
                  onClick={
                    selectedChatData.image
                      ? handleImageDelete
                      : handleFileInputClick
                  }
                >
                  {selectedChatData.image ? <IoTrash /> : <IoAddOutline />}
                </div>
              )}
              {isOwner && (
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  name="profile-image"
                  accept=".png, .jpg, .jpeg, .svg, .webp"
                  onChange={handleImageUpload}
                />
              )}
            </div>

            <div className="flex items-center justify-center gap-2">
              {editingName ? (
                <input
                  type="text"
                  className="bg-zinc-800 text-zinc-100 p-2 rounded-md outline-none"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                />
              ) : (
                <div className="text-2xl">{selectedChatData.name}</div>
              )}

              {isOwner && (
                <div className="flex gap-2 text-xl">
                  {editingName ? (
                    <>
                      <button
                        className="cursor-pointer text-zinc-500 hover:text-zinc-300"
                        onClick={() => handleChannelNameUpdate()}
                      >
                        <IoMdCheckmark />
                      </button>
                      <button
                        className="cursor-pointer text-zinc-500 hover:text-zinc-300"
                        onClick={() => {
                          setEditingName(false);
                          setNewChannelName(selectedChatData.name);
                        }}
                      >
                        <IoMdClose />
                      </button>
                    </>
                  ) : (
                    <button
                      className="cursor-pointer text-zinc-500 hover:text-zinc-300"
                      onClick={() => setEditingName(true)}
                    >
                      <IoPencil />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChannelInfo;
