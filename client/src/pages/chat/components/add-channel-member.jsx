import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSocket } from "@/context/SocketContext";
import useDebounce from "@/hooks/useDebounce";
import { apiClient } from "@/lib/api-client";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { ADD_CHANNEL_MEMBER, SEARCH_CONTACTS_ROUTE } from "@/utils/constants";
import React, { useState, useEffect } from "react";
import { FaFaceSadTear } from "react-icons/fa6";
import { IoPersonAdd } from "react-icons/io5";
import { PulseLoader } from "react-spinners";
import { toast } from "sonner";

const AddChannelMember = (props) => {
  const {} = props;
  const { selectedChatData } = useAppStore();
  const socket = useSocket();
  const [modalOpen, setModalOpen] = useState(false);
  const [searchContacts, setSearchContacts] = useState("");
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);

  const debouncedSearch = useDebounce(searchContacts, 300);

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setContacts([]);
      return;
    }

    const handleSearchContacts = async (e) => {
      setLoading(true);
      await apiClient
        .post(
          SEARCH_CONTACTS_ROUTE,
          { searchTerm: debouncedSearch },
          { withCredentials: true }
        )
        .then((res) => {
          if (res.status === 200) {
            const contacts = res.data.contacts.map((c) => {
              if (!selectedChatData.members.some((m) => m._id === c._id)) {
                return c;
              }
            });
            setContacts(contacts.filter((c) => c !== undefined));
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
    };

    handleSearchContacts();
  }, [debouncedSearch]);

  const handleAddMember = async (contact) => {
    const memberId = contact._id;
    const channelId = selectedChatData._id;
    await apiClient
      .post(
        ADD_CHANNEL_MEMBER,
        { channelId, memberId },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.msg);
          socket.emit("updateChannel", res.data.channel);
          setModalOpen(false);
        }
      })
      .catch((err) => {
        const msg = err.response?.data;
        toast.error(msg);
      });
  };

  useEffect(() => {
    setSearchContacts("");
    setContacts([]);
  }, [modalOpen]);

  return (
    <>
      <button
        className="flex items-center gap-2 w-full text-md rounded-lg p-3 cursor-pointer bg-purple-700 hover:bg-purple-600 active:bg-purple-800 text-purple-100 transition-all duration-300"
        onClick={() => {
          setModalOpen(true);
        }}
      >
        <IoPersonAdd />
        Додати учасника
      </button>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 border-0 w-[90vw] max-w-[420px] h-[420px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-center">Додати учасника</DialogTitle>
          </DialogHeader>
          <div>
            <Input
              placeholder="Пошук контактів"
              className="border-none outline-none dark:bg-zinc-800 dark:text-zinc-300 dark:placeholder:text-zinc-400 p-4 my-2 focus-visible:ring-0"
              value={searchContacts}
              onChange={(e) => {
                setSearchContacts(e.target.value);
              }}
            />
          </div>

          {debouncedSearch.length > 0 ? (
            loading ? (
              <div className="flex-1 flex justify-center items-center">
                <PulseLoader color="#7e22ce" />
              </div>
            ) : contacts.length > 0 ? (
              <ScrollArea className="flex flex-1 min-h-0 flex-col gap-3">
                {contacts.map((contact, i) => (
                  <div
                    key={i}
                    className="flex w-full gap-5 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl cursor-pointer p-3"
                    onClick={() => {
                      handleAddMember(contact);
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
                    <div className="flex flex-1 flex-col text-zinc-700 dark:text-zinc-300">
                      <p className="text-xl">
                        {contact?.firstName} {contact?.lastName}
                      </p>
                      <p className="text-sm">{contact.email}</p>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-xl text-zinc-700 dark:text-zinc-300 px-6 text-center gap-5">
                <FaFaceSadTear className="text-6xl" />
                <p>За вашим пошуковим запитом не знайдено жодного контакту</p>
              </div>
            )
          ) : (
            <div className="flex-1 dark:bg-zinc-900 flex flex-col justify-center items-center duration-1000 transition-all">
              <div className="text-center roboto-condensed-500">
                <p className="text-purple-500 text-2xl my-2">Привіт!</p>
                <p className="text-xl">
                  Знайдіть контакт, щоб додати його до групи!
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddChannelMember;
