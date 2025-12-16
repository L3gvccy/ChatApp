import { useAppStore } from "@/store";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactsContainer from "./components/contacts-container";
import EmptyChatContainer from "./components/empty-chat-container";
import ChatContainer from "./components/chat-container";
import { PropagateLoader } from "react-spinners";
import { apiClient } from "@/lib/api-client";
import {
  GET_CHANNELS_ROUTE,
  GET_CONTACTS_DM_ROUTE,
  GET_UNREAD_MESSAGES_COUNT_ROUTE,
} from "@/utils/constants";
import { initUreadCounts } from "@/lib/utils";

export default function Chat() {
  const {
    userInfo,
    selectedChatType,
    channelContacts,
    setChannelContacts,
    setDirectMessagesContacts,
  } = useAppStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast.warning("Ви маєте заповнити профіль для продовження");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  const getContactsDM = async () => {
    let contacts = [];
    await apiClient
      .get(GET_CONTACTS_DM_ROUTE, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          setDirectMessagesContacts(res.data.contacts);
          contacts = res.data.contacts;
        }
      })
      .catch((err) => {
        const msg = err.response?.data;
        toast.error(msg);
        return [];
      });

    return contacts;
  };

  const getContactsChannel = async () => {
    let channels = [];
    await apiClient
      .get(GET_CHANNELS_ROUTE, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          setChannelContacts(res.data.channels);
          channels = res.data.channels;
        }
      })
      .catch((err) => {
        const msg = err.response?.data;
        toast.error(msg);
      });

    return channels;
  };

  const getUnreadMessagesCount = async (contacts, channels) => {
    await apiClient
      .post(
        GET_UNREAD_MESSAGES_COUNT_ROUTE,
        {
          contactIds: contacts.map((c) => c.contact._id),
          channelIds: channels.map((c) => c._id),
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          initUreadCounts(res.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onLoad = async () => {
    const contacts = await getContactsDM();
    const channels = await getContactsChannel();
    await getUnreadMessagesCount(contacts, channels);
  };

  useEffect(() => {
    document.title = "QChat";
    onLoad();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center dark:bg-zinc-900">
        <PropagateLoader color="#7e22ce" />
      </div>
    );
  }

  return (
    <div className="flex h-screen text-gray-100 overflow-hidden">
      <ContactsContainer />
      {selectedChatType != undefined ? (
        <ChatContainer />
      ) : (
        <EmptyChatContainer />
      )}
    </div>
  );
}
