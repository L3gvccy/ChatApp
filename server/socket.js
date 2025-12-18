import { Server as SocketIoServer } from "socket.io";
import Message from "./models/MessageModel.js";
import Channel from "./models/ChannelModel.js";
import ContactsDM from "./models/ContactsDMModel.js";
import User from "./models/UserModel.js";
import mongoose from "mongoose";

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
        updateUserStatus(userId, false);
        break;
      }
    }
  };

  const updateUserInfo = (user) => {};

  const updateUserStatus = async (userId, isOnline) => {
    try {
      const userSocketId = userSocketMap.get(userId);
      const id = new mongoose.Types.ObjectId(userId);

      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { isOnline: isOnline, lastOnline: new Date() },
        { new: true }
      );

      const userContacts = await ContactsDM.findOne({ user: userId })
        .populate(
          "contacts.contact",
          "_id firstName lastName email color image isOnline lastOnline"
        )
        .populate("contacts.lastMessage");

      if (userContacts) {
        const contactIds = userContacts.contacts.map((c) => {
          return c.contact._id.toString();
        });

        contactIds.forEach((contactId) => {
          const contactSocketId = userSocketMap.get(contactId);

          if (contactSocketId) {
            io.to(contactSocketId).emit("userUpdated", updatedUser);
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async (message) => {
    const senderSocketId = userSocketMap.get(message.sender);
    const recieverSocketId = userSocketMap.get(message.reciever);

    const createdMessage = await Message.create(message);

    const messageData = await Message.findById(createdMessage._id)
      .populate(
        "sender",
        "id email firstName lastName image color isOnline lastOnline"
      )
      .populate(
        "reciever",
        "id email firstName lastName image color isOnline lastOnline"
      );

    let updatedSender = await ContactsDM.findOneAndUpdate(
      {
        user: message.sender,
        "contacts.contact": message.reciever,
      },
      {
        $set: { "contacts.$.lastMessage": createdMessage._id },
      },
      { new: true }
    );

    if (!updatedSender) {
      await ContactsDM.findOneAndUpdate(
        { user: message.sender },
        {
          $push: {
            contacts: {
              contact: message.reciever,
              lastMessage: createdMessage._id,
            },
          },
        },
        { upsert: true }
      );
    }
    updatedSender = await ContactsDM.findOne({ user: message.sender })
      .populate(
        "contacts.contact",
        "_id firstName lastName email color image isOnline lastOnline"
      )
      .populate("contacts.lastMessage");

    let updatedReciever = await ContactsDM.findOneAndUpdate(
      {
        user: message.reciever,
        "contacts.contact": message.sender,
      },
      {
        $set: { "contacts.$.lastMessage": createdMessage._id },
      },
      { new: true }
    );

    if (!updatedReciever) {
      await ContactsDM.findOneAndUpdate(
        { user: message.reciever },
        {
          $push: {
            contacts: {
              contact: message.sender,
              lastMessage: createdMessage._id,
            },
          },
        },
        { upsert: true }
      );
    }
    updatedReciever = await ContactsDM.findOne({
      user: message.reciever,
    })
      .populate(
        "contacts.contact",
        "_id firstName lastName email color image isOnline lastOnline"
      )
      .populate("contacts.lastMessage");

    if (recieverSocketId) {
      io.to(recieverSocketId).emit("recieveMessage", messageData);
      io.to(recieverSocketId).emit("updateContacts", updatedReciever.contacts);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("recieveMessage", messageData);
      io.to(senderSocketId).emit("updateContacts", updatedSender.contacts);
    }
  };

  const sendChannelMessage = async (message) => {
    const senderSocketId = userSocketMap.get(message.sender.toString());

    const createdMessage = await Message.create(message);

    const messageData = await Message.findById(createdMessage._id).populate(
      "sender",
      "_id email firstName lastName image color isOnline lastOnline"
    );

    const channel = await Channel.findByIdAndUpdate(
      message.channel,
      { lastActivity: Date.now(), lastMessage: createdMessage._id },
      { new: true }
    )
      .populate(
        "owner",
        "_id firstName lastName email color image isOnline lastOnline"
      )
      .populate(
        "members",
        "_id firstName lastName email color image isOnline lastOnline"
      )
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "firstName",
        },
      });

    const ownerSocketId = userSocketMap.get(channel.owner._id.toString());

    if (senderSocketId) {
      io.to(senderSocketId).emit("recieveMessage", messageData);
      io.to(senderSocketId).emit("channelUpdated", channel);
    }

    if (
      ownerSocketId &&
      channel.owner._id.toString() !== message.sender.toString()
    ) {
      io.to(ownerSocketId).emit("recieveMessage", messageData);
      io.to(ownerSocketId).emit("channelUpdated", channel);
    }

    channel.members.forEach((member) => {
      if (member._id.toString() !== message.sender.toString()) {
        const memberSocketId = userSocketMap.get(member._id.toString());
        if (memberSocketId) {
          io.to(memberSocketId).emit("recieveMessage", messageData);
          io.to(memberSocketId).emit("channelUpdated", channel);
        }
      }
    });
  };

  const createChannel = async (channel) => {
    const ownerSocketId = userSocketMap.get(channel.owner);
    const members = channel.members;

    let createdChannel = await Channel.create(channel);

    createdChannel = await Channel.findById(createdChannel._id)
      .populate(
        "owner",
        "_id firstName lastName email color image isOnline lastOnline"
      )
      .populate(
        "members",
        "_id firstName lastName email color image isOnline lastOnline"
      );

    if (ownerSocketId) {
      io.to(ownerSocketId).emit("channelCreated", createdChannel);
    }

    members.forEach((member) => {
      const memberSocketId = userSocketMap.get(member);

      io.to(memberSocketId).emit("channelCreated", createdChannel);
    });
  };

  const updateChannel = async (channel) => {
    const ownerSocketId = userSocketMap.get(channel.owner._id);
    const members = channel.members;

    if (ownerSocketId) {
      io.to(ownerSocketId).emit("channelUpdated", channel);
    }
    members.forEach((member) => {
      const memberSocketId = userSocketMap.get(member._id);

      io.to(memberSocketId).emit("channelUpdated", channel);
    });
  };

  const deleteChannel = async (channelId, owner, members) => {
    const ownerSocketId = userSocketMap.get(owner._id);
    if (ownerSocketId) {
      io.to(ownerSocketId).emit("channelDeleted", channelId);
    }
    members.forEach((member) => {
      const memberSocketId = userSocketMap.get(member._id);
      io.to(memberSocketId).emit("channelDeleted", channelId);
    });
  };

  const removeChannelMember = async (channelId, memberId) => {
    const updatedChannel = await Channel.findByIdAndUpdate(
      channelId,
      { $pull: { members: memberId } },
      { new: true }
    )
      .populate(
        "owner",
        "_id firstName lastName email color image isOnline lastOnline"
      )
      .populate(
        "members",
        "_id firstName lastName email color image isOnline lastOnline"
      )
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "firstName",
        },
      });

    const ownerSocketId = userSocketMap.get(
      updatedChannel.owner._id.toString()
    );
    const memberSocketId = userSocketMap.get(memberId);

    if (memberSocketId) {
      io.to(memberSocketId).emit("channelDeleted", updatedChannel._id);
    }

    if (ownerSocketId) {
      io.to(ownerSocketId).emit("channelUpdated", updatedChannel);
    }

    updatedChannel.members.forEach((m) => {
      if (m._id.toString() !== memberId.toString()) {
        const mSocketId = userSocketMap.get(m._id.toString());
        if (mSocketId) {
          io.to(mSocketId).emit("channelUpdated", updatedChannel);
        }
      }
    });
  };

  io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket Id ${socket.id}`);
      await updateUserStatus(userId, true);
    } else {
      console.log("User ID not provided");
    }

    socket.on("sendMessage", sendMessage);
    socket.on("sendChannelMessage", sendChannelMessage);
    socket.on("createChannel", createChannel);
    socket.on("updateChannel", updateChannel);
    socket.on("deleteChannel", deleteChannel);
    socket.on("removeChannelMember", removeChannelMember);
    socket.on("disconnect", () => disconnect(socket));
  });
};

export default setupSocket;
