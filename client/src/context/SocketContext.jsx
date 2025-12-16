import { apiClient } from "@/lib/api-client";
import { AddUnreadCount } from "@/lib/utils";
import { useAppStore } from "@/store";
import { GET_CONTACTS_DM_ROUTE, HOST } from "@/utils/constants";
import { createContext, useState, useEffect, useRef, useContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { userInfo } = useAppStore();

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo._id },
      });

      socket.current.on("connect", () => {
        console.log(userInfo);
        console.log("Connected to socket server");
      });

      const handleRecieveMessage = async (message) => {
        const {
          userInfo,
          selectedChatType,
          selectedChatData,
          addMessage,
          directMessagesContacts,
          setDirectMessagesContacts,
        } = useAppStore.getState();

        if (
          selectedChatType == "contact" &&
          !message.channel &&
          (selectedChatData._id === message.sender?._id ||
            selectedChatData._id === message.reciever?._id)
        ) {
          addMessage(message);
        } else if (
          selectedChatType == "channel" &&
          selectedChatData._id === message.channel
        ) {
          addMessage(message);
        } else if (message?.reciever?._id === userInfo._id || message.channel) {
          message.reciever
            ? AddUnreadCount(message.sender._id)
            : AddUnreadCount(message.channel);
        }
      };

      const updateContacts = (contacts) => {
        const { setDirectMessagesContacts } = useAppStore.getState();

        const sortedContacts = [...contacts].sort((a, b) => {
          return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
        });

        sortedContacts.length > 0 && setDirectMessagesContacts(sortedContacts);
      };

      const handleAddChannel = (channel) => {
        const { channelContacts, setChannelContacts } = useAppStore.getState();

        setChannelContacts([...channelContacts, channel]);
      };

      const handleChannelUpdated = (channel) => {
        const {
          channelContacts,
          setChannelContacts,
          selectedChatData,
          setSelectedChatData,
        } = useAppStore.getState();

        if (!channelContacts.some((c) => c._id === channel._id)) {
          setChannelContacts([...channelContacts, channel]);
          return;
        }

        const updatedChannels = channelContacts.map((c) => {
          if (c._id === channel._id) {
            return channel;
          }
          return c;
        });
        setChannelContacts(updatedChannels);
        if (selectedChatData?._id === channel?._id) {
          setSelectedChatData(channel);
        }
      };

      const handleChannelDeleted = (channelId) => {
        const {
          channelContacts,
          setChannelContacts,
          selectedChatData,
          setSelectedChatData,
          setSelectedChatType,
        } = useAppStore.getState();
        const updatedChannels = channelContacts.filter(
          (c) => c._id !== channelId
        );
        setChannelContacts(updatedChannels);
        if (selectedChatData._id === channelId) {
          setSelectedChatData(null);
          setSelectedChatType(null);
        }
      };

      socket.current.on("recieveMessage", handleRecieveMessage);
      socket.current.on("updateContacts", updateContacts);
      socket.current.on("channelCreated", handleAddChannel);
      socket.current.on("channelUpdated", handleChannelUpdated);
      socket.current.on("channelDeleted", handleChannelDeleted);

      return () => {
        socket.current.disconnect();
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
