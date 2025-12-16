import React, { useState, useEffect } from "react";
import ProfileInfo from "./profile-info";
import NewDM from "./new-dm";
import { apiClient } from "@/lib/api-client";
import {
  GET_CHANNELS_ROUTE,
  GET_CONTACTS_DM_ROUTE,
  MARK_AS_READ_ROUTE,
} from "@/utils/constants";
import { getColor } from "@/lib/utils";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAppStore } from "@/store";
import NewChannel from "./new-channel";
import { ScrollArea } from "@/components/ui/scroll-area";
import ThemeButton from "@/components/theme-button";

const ContactsContainer = () => {
  const {
    channelContacts,
    setSelectedChatType,
    setSelectedChatData,
    setSelectedChatMessages,
    setChannelContacts,
    setDirectMessagesContacts,
  } = useAppStore();
  const directMessagesContacts = useAppStore(
    (state) => state.directMessagesContacts
  );
  const selectedChatData = useAppStore((state) => state.selectedChatData);

  const getContactsDM = async () => {
    apiClient
      .get(GET_CONTACTS_DM_ROUTE, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          setDirectMessagesContacts(res.data.contacts);
        }
      })
      .catch((err) => {
        const msg = err.response?.data;
        toast.error(msg);
      });
  };

  const getContactsChannel = async () => {
    apiClient
      .get(GET_CHANNELS_ROUTE, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          setChannelContacts(res.data.channels);
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

  const handleChooseChannel = async (channel) => {
    if (selectedChatData?._id !== channel._id) {
      setSelectedChatMessages([]);
    }
    setSelectedChatType("channel");
    setSelectedChatData(channel);

    await apiClient.post(
      MARK_AS_READ_ROUTE,
      { channelId: channel._id },
      { withCredentials: true }
    );
  };

  const getUnreadMessagesCount = async () => {
    await apiClient
      .post(
        GET_UNREAD_MESSAGES_COUNT_ROUTE,
        {
          contactIds: directMessagesContacts.map((c) => c._id),
          channelIds: channelContacts.map((c) => c._id),
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          // Handle unread counts here if needed
        }
      });
  };

  useEffect(() => {
    getContactsDM();
    getContactsChannel();
  }, []);

  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] w-full border-purple-200 dark:bg-zinc-900 border-r-2 dark:border-zinc-800">
      <Logo />
      <ScrollArea className="h-[80vh]">
        <div className="my-5">
          <div className="flex items-center justify-between pr-10 mb-5">
            <Title text="Особисті чати" />
            <NewDM />
          </div>
          {directMessagesContacts.map((contact, i) => {
            contact = contact.contact;

            return (
              <div className="flex w-full px-4 mb-2" key={contact._id}>
                <div
                  key={i}
                  className={`flex w-full gap-5  rounded-lg cursor-pointer p-3 ${
                    selectedChatData?._id === contact._id
                      ? "bg-purple-800 hover:bg-purple-700"
                      : "hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
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
                  <div
                    className={`flex flex-1 flex-col justify-center dark:text-zinc-300 ${
                      selectedChatData?._id === contact._id
                        ? "text-zinc-100"
                        : "text-zinc-900"
                    }`}
                  >
                    <p className="text-md">
                      {contact?.firstName
                        ? `${contact.firstName} ${contact.lastName}`
                        : `${contact.email}`}
                    </p>
                  </div>
                  {/* <div className="flex items-center justify-center ">
                  <div className="bg-purple-700 text-zinc-100 text-sm rounded-full w-8 h-8 flex items-center-safe justify-center-safe">
                    9+
                  </div>
                </div> */}
                </div>
              </div>
            );
          })}
        </div>
        <div className="my-5">
          <div className="flex items-center justify-between pr-10 mb-5">
            <Title text="Групові чати" />
            <NewChannel />
          </div>

          {channelContacts
            .sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity))
            .map((channel, i) => (
              <div className="flex w-full px-4 mb-2" key={channel._id}>
                <div
                  key={i}
                  className={`flex w-full gap-5  rounded-lg cursor-pointer p-3 ${
                    selectedChatData?._id === channel._id
                      ? "bg-purple-800 hover:bg-purple-700"
                      : "hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                  }`}
                  onClick={() => {
                    handleChooseChannel(channel);
                  }}
                >
                  <Avatar className="h-12 w-12 rounded-full overflow-hidden ">
                    {channel.image ? (
                      <AvatarImage
                        src={channel.image}
                        alt="Фото профілю"
                        className="object-cover w-full h-full bg-black"
                      />
                    ) : (
                      <div
                        className={`uppercase h-12 w-12 text-2xl rounded-full flex justify-center items-center ${getColor(
                          channel.color
                        )}`}
                      >
                        {channel.name.split("").shift()}
                      </div>
                    )}
                  </Avatar>
                  <div
                    className={`flex flex-1 flex-col justify-center dark:text-zinc-300 ${
                      selectedChatData?._id === channel._id
                        ? "text-zinc-100"
                        : "text-zinc-900"
                    }`}
                  >
                    <p className="text-md">{channel.name}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </ScrollArea>
      <ProfileInfo />
    </div>
  );
};

export default ContactsContainer;

const Logo = () => {
  return (
    <div
      id="logo"
      className="flex justify-between text-2xl roboto-condensed-700 text-purple-700 p-4 bg-purple-200 dark:bg-zinc-800 rounded-b-lg"
    >
      <div className="flex gap-5 items-center">
        <img src="/logo.png" alt="" className="w-8 h-8" />
        <p>QChat</p>
      </div>
      <div>
        <ThemeButton />
      </div>
    </div>
  );
};

const Title = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-gray-900/90 dark:text-gray-400/90 pl-10 font-light text-sm">
      {text}
    </h6>
  );
};
