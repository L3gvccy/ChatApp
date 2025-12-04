import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PulseLoader } from "react-spinners";
import { IoAddOutline } from "react-icons/io5";
import { FaFaceSadTear } from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { animationDefaultOptions, getColor } from "@/lib/utils";
import Lottie from "react-lottie";
import { apiClient } from "@/lib/api-client";
import { SEARCH_CONTACTS_ROUTE } from "@/utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";

const NewDM = () => {
  const { setSelectedChatType, setSelectedChatData } = useAppStore();
  const [newDMModalOpen, setNewDMModalOpen] = useState(false);
  const [searchContacts, setSearchContacts] = useState("");
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);

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
            setContacts(res.data.contacts);
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
    setNewDMModalOpen(false);
    setSelectedChatType("dm");
    setSelectedChatData(contact);
    setSearchContacts([]);
  };

  return (
    <div>
      <Tooltip>
        <TooltipTrigger
          className="text-xl text-gray-400/90 cursor-pointer hover:text-gray-300 active:text-gray-500"
          onClick={() => {
            setNewDMModalOpen(true);
          }}
        >
          <IoAddOutline />
        </TooltipTrigger>
        <TooltipContent>Новий особистий чат</TooltipContent>
      </Tooltip>
      <Dialog open={newDMModalOpen} onOpenChange={setNewDMModalOpen}>
        <DialogContent className="bg-zinc-900 border-0 text-zinc-100 w-[90vw] max-w-[420px] h-[420px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-center">
              Новий особистий чат
            </DialogTitle>
          </DialogHeader>
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
              <ScrollArea className="flex flex-col gap-3">
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
                <p className="text-xl">Знайди контакт, щоб почати розмову!</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewDM;
