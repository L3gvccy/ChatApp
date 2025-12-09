import React, { useState, useEffect } from "react";
import ProfileInfo from "./profile-info";
import NewDM from "./new-dm";
import { apiClient } from "@/lib/api-client";
import { GET_CONTACTS_DM_ROUTE } from "@/utils/constants";
import { getColor } from "@/lib/utils";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAppStore } from "@/store";
import { useSocket } from "@/context/SocketContext";
import NewChannel from "./new-channel";

const ContactsContainer = () => {
  const socket = useSocket();
  const {
    selectedChatData,
    selectedChatMessages,
    setSelectedChatType,
    setSelectedChatData,
    setDirectMessagesContacts,
  } = useAppStore();
  const directMessagesContacts = useAppStore(
    (state) => state.directMessagesContacts
  );

  const getContactsDM = async () => {
    apiClient
      .get(GET_CONTACTS_DM_ROUTE, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          setDirectMessagesContacts(res.data.contacts);
          console.log(res.data.contacts);
        }
      })
      .catch((err) => {
        const msg = err.response?.data;
        toast.error(msg);
      });
  };

  const handleChooseContact = async (contact) => {
    setSelectedChatType("contact");
    setSelectedChatData(contact);
  };

  useEffect(() => {
    getContactsDM();
  }, []);

  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] w-full bg-zinc-900 border-r-2 border-zinc-800">
      <Logo />
      <div className="my-5">
        <div className="flex items-center justify-between pr-10 mb-5">
          <Title text="Особисті чати" />
          <NewDM />
        </div>
        {directMessagesContacts.map((contact, i) => (
          <div className="flex w-full px-4 mb-2" key={contact._id}>
            <div
              key={i}
              className={`flex w-full gap-5  rounded-lg cursor-pointer p-3 ${
                selectedChatData?._id === contact._id
                  ? "bg-purple-800 hover:bg-purple-700"
                  : "bg-zinc-900 hover:bg-zinc-800"
              }`}
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
              <div className="flex flex-1 flex-col justify-center text-zinc-300">
                <p className="text-md">
                  {contact?.firstName
                    ? `${contact.firstName} ${contact.lastName}`
                    : `${contact.email}`}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Групові чати" />
          <NewChannel />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
};

export default ContactsContainer;

const Logo = () => {
  return (
    <div
      id="logo"
      className="flex gap-5 text-2xl roboto-condensed-700 text-purple-700 p-4 bg-zinc-800 rounded-b-lg"
    >
      <img src="/logo.png" alt="" className="w-8 h-8" />
      <p>QChat</p>
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-gray-400/90 pl-10 font-light text-sm">
      {text}
    </h6>
  );
};
