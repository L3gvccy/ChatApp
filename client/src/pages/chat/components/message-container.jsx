import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { apiClient } from "@/lib/api-client";
import { getColor, getFileName } from "@/lib/utils";
import { useAppStore } from "@/store";
import {
  DOWNLOAD_FILE_ROUTE,
  GET_CHANNEL_MESSAGES_ROUTE,
  GET_MESSAGES_ROUTE,
} from "@/utils/constants";
import moment from "moment";
import React, { useRef, useEffect } from "react";
import { FaFile, FaDownload } from "react-icons/fa6";

const MessageContainer = () => {
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages,
  } = useAppStore();

  const checkIfImage = (file) => {
    const imgRegex = /\.(jpg|jpeg|png|gif|bmp|svg|webp)$/i;
    return imgRegex.test(file);
  };

  const handleFileSave = async (fileUrl) => {
    if (!fileUrl) return;

    try {
      const response = await apiClient.get(DOWNLOAD_FILE_ROUTE, {
        params: { url: fileUrl },
        responseType: "blob",
        withCredentials: true,
      });

      let fileName = fileUrl.split("/").pop().split("?")[0];

      if (!fileName.includes(".")) {
        const mimeType = response.headers["content-type"];
        const ext = mimeType ? mimeType.split("/")[1] : "bin";
        fileName = `${fileName}.${ext}`;
      }

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const downloadUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate != lastDate;
      lastDate = messageDate;
      return (
        <div key={message._id}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}

          {selectedChatType === "channel" &&
            selectedChatMessages.length > 0 &&
            renderChannelMessages(message)}
        </div>
      );
    });
  };

  const renderDMMessages = (message) => (
    <div
      className={`${
        message.sender !== selectedChatData._id ? "text-right" : "text-left"
      }`}
    >
      {message.type === "text" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-purple-700 text-purple-300 border-purple-900/50 rounded-bl-2xl"
              : "bg-zinc-700 text-zinc-300 border-zinc-900/50 rounded-br-2xl"
          } border inline-block px-4 py-2 rounded-t-2xl my-1 max-w-[50%] wrap-break-word`}
        >
          {message.content}
        </div>
      )}

      {message.type === "file" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-purple-700 text-purple-300 border-purple-900/50 rounded-bl-2xl"
              : "bg-zinc-700 text-zinc-300 border-zinc-900/50 rounded-br-2xl"
          } border inline-block px-4 py-2 rounded-t-2xl my-1 max-w-[50%] wrap-break-word`}
        >
          {checkIfImage(message.fileUrl) ? (
            <div
              className="cursor-pointer"
              onClick={() => {
                handleFileSave(message.fileUrl);
              }}
            >
              <img
                src={message.fileUrl}
                className="w-full max-w-[320px] max-h-80"
              />
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-xl rounded-full p-2 bg-white/30">
                <FaFile />
              </span>
              <span className=" p-2">{message.fileUrl.split("/").pop()}</span>
              <span
                className=" cursor-pointer text-xl rounded-full p-2 bg-white/30 hover:bg-white/40"
                onClick={() => {
                  handleFileSave(message.fileUrl);
                }}
              >
                <FaDownload />
              </span>
            </div>
          )}
        </div>
      )}
      <div className="text-xs text-zinc-500">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );

  const renderChannelMessages = (message) => (
    console.log(message),
    (
      <div
        className={`mb-2 ${
          message.sender._id === userInfo._id ? "text-right" : "text-left"
        }`}
      >
        <div
          className={`flex gap-2 ${
            message.sender._id === userInfo._id
              ? "flex-row-reverse"
              : "text-left"
          }`}
        >
          <Avatar className="h-6 w-6 rounded-full overflow-hidden ">
            {message.sender.image ? (
              <AvatarImage
                src={message.sender.image}
                alt="Фото профілю"
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div
                className={`uppercase h-6 w-6 text-md rounded-full flex justify-center items-center ${getColor(
                  message.sender.color
                )}`}
              >
                {message.sender.firstName
                  ? message.sender.firstName.split("").shift()
                  : message.sender.email.split("").shift()}
              </div>
            )}
          </Avatar>
          <span className="text-sm text-zinc-500">
            {message.sender._id === userInfo._id
              ? "Ви"
              : `${message.sender.firstName} ${message.sender.lastName}`}
          </span>
        </div>
        {message.type === "text" && (
          <div
            className={`${
              message.sender._id === userInfo._id
                ? "bg-purple-700 text-purple-300 border-purple-900/50 rounded-bl-2xl"
                : "bg-zinc-700 text-zinc-300 border-zinc-900/50 rounded-br-2xl"
            } border inline-block px-4 py-2 rounded-t-2xl my-1 max-w-[50%] wrap-break-word`}
          >
            {message.content}
          </div>
        )}

        {message.type === "file" && (
          <div
            className={`${
              message.sender !== selectedChatData._id
                ? "bg-purple-700 text-purple-300 border-purple-900/50 rounded-bl-2xl"
                : "bg-zinc-700 text-zinc-300 border-zinc-900/50 rounded-br-2xl"
            } border inline-block px-4 py-2 rounded-t-2xl my-1 max-w-[50%] wrap-break-word`}
          >
            {checkIfImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  handleFileSave(message.fileUrl);
                }}
              >
                <img
                  src={message.fileUrl}
                  className="w-full max-w-[320px] max-h-80"
                />
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-xl rounded-full p-2 bg-white/30">
                  <FaFile />
                </span>
                <span className=" p-2">{message.fileUrl.split("/").pop()}</span>
                <span
                  className=" cursor-pointer text-xl rounded-full p-2 bg-white/30 hover:bg-white/40"
                  onClick={() => {
                    handleFileSave(message.fileUrl);
                  }}
                >
                  <FaDownload />
                </span>
              </div>
            )}
          </div>
        )}
        <div className="text-xs text-zinc-500">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    )
  );

  const getAllMessagesContact = async () => {
    await apiClient
      .post(
        GET_MESSAGES_ROUTE,
        { id: selectedChatData._id },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          setSelectedChatMessages(res.data.messages);
        }
      })
      .catch((err) => {
        const msg = err.response?.data;
        toast.error(msg);
      });
  };

  const getAllMessagesChannel = async () => {
    await apiClient
      .post(
        GET_CHANNEL_MESSAGES_ROUTE,
        { channelId: selectedChatData._id },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 200) {
          setSelectedChatMessages(res.data.messages);
        }
      })
      .catch((err) => {
        const msg = err.response?.data;
        toast.error(msg);
      });
  };

  useEffect(() => {
    if (selectedChatType === "contact") {
      getAllMessagesContact();
    } else if (selectedChatType === "channel") {
      getAllMessagesChannel();
    }
  }, [selectedChatData]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8">
      {renderMessages()}
      <div ref={scrollRef}></div>
    </div>
  );
};

export default MessageContainer;
