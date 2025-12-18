import React, { useState, useEffect } from "react";
import ProfileInfo from "./profile-info";
import NewDM from "./new-dm";
import { apiClient } from "@/lib/api-client";
import {
  GET_CHANNELS_ROUTE,
  GET_CONTACTS_DM_ROUTE,
  GET_UNREAD_MESSAGES_COUNT_ROUTE,
  MARK_AS_READ_ROUTE,
} from "@/utils/constants";
import {
  getColor,
  getUnreadCount,
  initUreadCounts,
  ResetUnreadCount,
} from "@/lib/utils";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAppStore } from "@/store";
import NewChannel from "./new-channel";
import { ScrollArea } from "@/components/ui/scroll-area";
import ThemeButton from "@/components/theme-button";
import UnreadCount from "./unread-count";
import OnlineIndicator from "./online-indicator";
import DisplayLastMessage from "./display-last-message";
import dayjs from "dayjs";

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

  const handleChooseContact = async (contact) => {
    setSelectedChatType("contact");
    setSelectedChatData(contact);
    ResetUnreadCount(contact._id);

    await apiClient.post(
      MARK_AS_READ_ROUTE,
      { contactId: contact._id },
      { withCredentials: true }
    );
  };

  const handleChooseChannel = async (channel) => {
    if (selectedChatData?._id !== channel._id) {
      setSelectedChatMessages([]);
    }
    setSelectedChatType("channel");
    setSelectedChatData(channel);
    ResetUnreadCount(channel._id);
    console.log(channel._id);

    await apiClient.post(
      MARK_AS_READ_ROUTE,
      { channelId: channel._id },
      { withCredentials: true }
    );
  };

  return (
    <div className="relative md:w-[40vw] lg:w-[30vw] xl:w-[25vw] w-full border-purple-200 dark:bg-zinc-900 border-r-2 dark:border-zinc-800">
      <Logo />
      <ScrollArea className="h-[80vh]">
        <div className="my-5">
          <div className="flex items-center justify-between pr-10 mb-5">
            <Title text="Особисті чати" />
            <NewDM />
          </div>
          {directMessagesContacts.map((contactInfo, i) => {
            const contact = contactInfo.contact;

            return (
              <div className="flex w-full px-4 mb-2" key={contact._id}>
                <div
                  key={i}
                  className={`flex w-full gap-2 rounded-lg cursor-pointer p-3 items-center ${
                    selectedChatData?._id === contact._id
                      ? "bg-purple-800 hover:bg-purple-700"
                      : "hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                  }`}
                  onClick={() => {
                    handleChooseContact(contact);
                  }}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12 rounded-full overflow-hidden relative">
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
                    {contact.isOnline && (
                      <OnlineIndicator
                        size={2.5}
                        active={selectedChatData?._id === contact._id}
                      />
                    )}
                  </div>
                  <div className="grid grid-cols-[1fr_auto] w-full">
                    <div
                      className={`flex-1 min-w-0 flex flex-col gap-1 items-center dark:text-zinc-300 ${
                        selectedChatData?._id === contact._id
                          ? "text-zinc-100"
                          : "text-zinc-900"
                      }`}
                    >
                      <div className="w-full grid grid-cols-[1fr_auto] items-center gap-2">
                        <div className="min-w-0 overflow-hidden">
                          <p className="text-md truncate whitespace-nowrap font-semibold">
                            {contact?.firstName
                              ? `${contact.firstName} ${contact.lastName}`
                              : contact.email}
                          </p>
                        </div>

                        <div
                          className={`text-xs ${
                            selectedChatData?._id === contact._id
                              ? "text-zinc-300"
                              : "text-zinc-500"
                          }`}
                        >
                          {dayjs(contactInfo.lastMessage.timestamp).format(
                            "LT"
                          )}
                        </div>
                      </div>

                      <div className="w-full grid grid-cols-[1fr_auto] items-center gap-2">
                        {contactInfo.lastMessage && (
                          <>
                            <DisplayLastMessage
                              chatType="contact"
                              message={contactInfo.lastMessage}
                              isSelected={selectedChatData?._id === contact._id}
                            />
                            <UnreadCount id={contact._id} />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
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
                  <div className="grid grid-cols-[1fr_auto] w-full">
                    <div
                      className={`flex flex-1 flex-col justify-center dark:text-zinc-300 ${
                        selectedChatData?._id === channel._id
                          ? "text-zinc-100"
                          : "text-zinc-900"
                      }`}
                    >
                      <div className="w-full grid grid-cols-[1fr_auto] items-center gap-2">
                        <div className="min-w-0 overflow-hidden">
                          <p className="text-md truncate whitespace-nowrap font-semibold">
                            {channel.name}
                          </p>
                        </div>

                        <div
                          className={`text-xs ${
                            selectedChatData?._id === channel._id
                              ? "text-zinc-300"
                              : "text-zinc-500"
                          }`}
                        >
                          {channel?.lastMessage
                            ? `${dayjs(channel?.lastMessage?.timestamp).format(
                                "LT"
                              )}`
                            : `${dayjs(channel.lastActivity).format("LT")}`}
                        </div>
                      </div>

                      <div className="w-full grid grid-cols-[1fr_auto] items-center gap-2">
                        {channel.lastMessage && (
                          <>
                            <DisplayLastMessage
                              chatType="channel"
                              message={channel.lastMessage}
                              isSelected={selectedChatData?._id === channel._id}
                            />
                            <UnreadCount id={channel._id} />
                          </>
                        )}
                      </div>
                    </div>
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
