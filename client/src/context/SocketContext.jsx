import { apiClient } from "@/lib/api-client";
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
          selectedChatType,
          selectedChatData,
          addMessage,
          directMessagesContacts,
          setDirectMessagesContacts,
        } = useAppStore.getState();

        if (
          selectedChatType != undefined &&
          (selectedChatData._id === message.sender._id ||
            selectedChatData._id === message.reciever._id)
        ) {
          addMessage(message);
        }

        const res = await apiClient.get(GET_CONTACTS_DM_ROUTE, {
          withCredentials: true,
        });

        res.data.contacts.length > 0 &&
          setDirectMessagesContacts(res.data.contacts);
      };

      socket.current.on("recieveMessage", handleRecieveMessage);

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
