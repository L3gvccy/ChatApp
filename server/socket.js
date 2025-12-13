import { Server as SocketIoServer } from "socket.io";
import Message from "./models/MessageModel.js";
import Channel from "./models/ChannelModel.js";

const setupSocket = (server) => {
  const io = new SocketIoServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const disconnect = (socket) => {
    console.log(`User disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  const sendMessage = async (message) => {
    const senderSocketId = userSocketMap.get(message.sender);
    const recieverSocketId = userSocketMap.get(message.reciever);

    const createdMessage = await Message.create(message);

    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .populate("reciever", "id email firstName lastName image color");

    if (recieverSocketId) {
      io.to(recieverSocketId).emit("recieveMessage", messageData);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("recieveMessage", messageData);
    }
  };

  const sendChannelMessage = async (message) => {
    const senderSocketId = userSocketMap.get(message.sender);
    const channel = await Channel.findById(message.channel);

    const createdMessage = await Message.create(message);

    const messageData = await Message.findById(createdMessage._id).populate(
      "sender",
      "id email firstName lastName image color"
    );

    if (senderSocketId) {
      io.to(senderSocketId).emit("recieveMessage", messageData);
    }

    channel.members.forEach((member) => {
      if (member.toString() !== message.sender) {
        const memberSocketId = userSocketMap.get(member.toString());
        if (memberSocketId) {
          io.to(memberSocketId).emit("recieveMessage", messageData);
        }
      }
    });
  };

  const createChannel = async (channel) => {
    const ownerSocketId = userSocketMap.get(channel.owner);
    const members = channel.members;

    const createdChannel = await Channel.create(channel);

    if (ownerSocketId) {
      io.to(ownerSocketId).emit("channelCreated", createdChannel);
    }

    members.forEach((member) => {
      const memberSocketId = userSocketMap.get(member);

      io.to(memberSocketId).emit("channelCreated", createdChannel);
    });
  };

  const updateChannel = async (channel) => {
    const ownerSocketId = userSocketMap.get(channel.owner);
    const members = channel.members;

    if (ownerSocketId) {
      io.to(ownerSocketId).emit("channelUpdated", channel);
    }
    members.forEach((member) => {
      const memberSocketId = userSocketMap.get(member);

      io.to(memberSocketId).emit("channelUpdated", channel);
    });
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket Id ${socket.id}`);
    } else {
      console.log("User ID not provided");
    }

    socket.on("sendMessage", sendMessage);
    socket.on("sendChannelMessage", sendChannelMessage);
    socket.on("createChannel", createChannel);
    socket.on("updateChannel", updateChannel);
    socket.on("disconnect", () => disconnect(socket));
  });
};

export default setupSocket;
