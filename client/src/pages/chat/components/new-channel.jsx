import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSocket } from "@/context/SocketContext";
import { apiClient } from "@/lib/api-client";
import { animationDefaultOptions, getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { SEARCH_CONTACTS_ROUTE } from "@/utils/constants";
import React, { useState } from "react";
import { FaFaceSadTear } from "react-icons/fa6";
import { IoAddOutline, IoClose } from "react-icons/io5";
import Lottie from "react-lottie";
import { PulseLoader } from "react-spinners";

const NewChannel = () => {
  const socket = useSocket();
  const { userInfo } = useAppStore();
  const [newGroupChatModalOpen, setNewGroupChatModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [searchContacts, setSearchContacts] = useState("");
  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);

  const handleSearchContacts = async (e) => {
    const str = e.target.value;
    setSearchContacts(str);
    if (str.length > 0) {
      setLoading(true);
      await apiClient
        .post(
          SEARCH_CONTACTS_ROUTE,
          { searchTerm: str },
          { withCredentials: true }
        )
        .then((res) => {
          if (res.status === 200) {
            const resContacts = res.data.contacts.filter(
              (c) => !selectedContacts.some((s) => s._id === c._id)
            );

            setContacts(resContacts);
          }
        })
        .catch((err) => {
          const msg = err.response?.data;
          toast.error(msg);
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false);
          }, 300);
        });
    }
  };

  const handleChooseContact = (contact) => {
    setSelectedContacts((prev) => [...prev, contact]);
    setSearchContacts("");
  };

  const handleRemoveContact = (contact) => {
    setSelectedContacts((prev) => prev.filter((c) => c._id !== contact._id));
  };

  const createChannel = () => {
    const members = selectedContacts.map((c) => {
      return c["_id"];
    });
    socket.emit("createChannel", {
      owner: userInfo._id,
      name: name,
      members: members,
    });
    setNewGroupChatModalOpen(false);
  };

  return (
    <div>
      <Tooltip>
        <TooltipTrigger
          className="text-xl text-gray-400/90 cursor-pointer hover:text-gray-300 active:text-gray-500"
          onClick={() => {
            setNewGroupChatModalOpen(true);
          }}
        >
          <IoAddOutline />
        </TooltipTrigger>
        <TooltipContent>Новий груповий чат</TooltipContent>
      </Tooltip>
      <Dialog
        open={newGroupChatModalOpen}
        onOpenChange={setNewGroupChatModalOpen}
      >
        <DialogContent className="bg-zinc-900 border-0 text-zinc-100 w-[90vw] max-w-[420px] h-[580px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-center">
              Новий груповий чат
            </DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Назва групового чату"
            className="border-none outline-none bg-zinc-800 text-zinc-300 placeholder:text-zinc-400 p-4 my-2 focus-visible:ring-0"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <ScrollArea className="flex gap-2 h-20">
            {selectedContacts.length > 0 ? (
              selectedContacts.map((contact) => (
                <div className="inline-block me-2 mb-2 p-2 rounded-md border border-zinc-300">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 rounded-full overflow-hidden ">
                      {contact.image ? (
                        <AvatarImage
                          src={contact.image}
                          alt="Фото профілю"
                          className="object-cover w-full h-full bg-black"
                        />
                      ) : (
                        <div
                          className={`uppercase h-6 w-6 text-md rounded-full flex justify-center items-center ${getColor(
                            contact.color
                          )}`}
                        >
                          {contact.firstName
                            ? contact.firstName.split("").shift()
                            : contact.email.split("").shift()}
                        </div>
                      )}
                    </Avatar>
                    <div className="text-sm">
                      {contact.firstName
                        ? `${contact.firstName} ${contact.lastName}`
                        : contact.email}
                    </div>
                    <div
                      className="text-md text-zinc-300 focus:text-zinc-100 transition-all duration-300 cursor-pointer"
                      onClick={() => {
                        handleRemoveContact(contact);
                      }}
                    >
                      <IoClose />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-20 flex items-center justify-center text-zinc-300">
                Тут будуть відображатись обрані контакти
              </div>
            )}
            <div className=""></div>
          </ScrollArea>
          <div>
            <Input
              placeholder="Пошук контактів"
              className="border-none outline-none bg-zinc-800 text-zinc-300 placeholder:text-zinc-400 p-4 my-2 focus-visible:ring-0"
              value={searchContacts}
              onChange={(e) => {
                handleSearchContacts(e);
              }}
            />
          </div>

          {searchContacts.length > 0 ? (
            loading ? (
              <div className="flex-1 flex justify-center items-center">
                <PulseLoader color="#7e22ce" />
              </div>
            ) : contacts.length > 0 ? (
              <ScrollArea className="flex-1 flex-col gap-3 h-2">
                {contacts.map((contact, i) => (
                  <div
                    key={i}
                    className="flex w-full gap-5 bg-zinc-900 hover:bg-zinc-800 rounded-xl cursor-pointer p-3"
                    onClick={() => {
                      handleChooseContact(contact);
                    }}
                  >
                    <Avatar className="h-12 w-12 rounded-full overflow-hidden ">
                      {contact.image ? (
                        <AvatarImage
                          src={contact.image}
                          alt="Фото профілю"
                          className="object-cover w-full h-full bg-black"
                        />
                      ) : (
                        <div
                          className={`uppercase h-12 w-12 text-2xl rounded-full flex justify-center items-center ${getColor(
                            contact.color
                          )}`}
                        >
                          {contact.firstName
                            ? contact.firstName.split("").shift()
                            : contact.email.split("").shift()}
                        </div>
                      )}
                    </Avatar>
                    <div className="flex flex-1 flex-col text-zinc-300">
                      <p className="text-xl">
                        {contact?.firstName} {contact?.lastName}
                      </p>
                      <p className="text-sm">{contact.email}</p>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-xl text-zinc-300 px-6 text-center gap-5">
                <FaFaceSadTear className="text-6xl" />
                <p>За вашим пошуковим запитом не знайдено жодного контакту</p>
              </div>
            )
          ) : (
            <div className="flex-1 md:bg-zinc-900 flex flex-col justify-center items-center duration-1000 transition-all">
              <Lottie
                isClickToPauseDisabled={true}
                height={120}
                width={120}
                options={animationDefaultOptions}
              />
              <div className="text-center roboto-condensed-500">
                <p className="text-purple-500 text-2xl my-2">Привіт!</p>
                <p className="text-xl">
                  Знайди контакти, щоб створити груповий чат!
                </p>
              </div>
            </div>
          )}
          <button
            className="w-full py-2 rounded-lg bg-purple-700 hover:bg-purple-600 active:bg-purple-800 cursor-pointer disabled:cursor-auto disabled:bg-purple-950/90"
            disabled={selectedContacts.length < 1 || name.length < 1}
            onClick={createChannel}
          >
            Створити групу
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewChannel;
