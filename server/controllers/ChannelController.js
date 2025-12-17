import mongoose from "mongoose";
import Channel from "../models/ChannelModel.js";
import { v2 as cloudinary } from "cloudinary";
import Message from "../models/MessageModel.js";

export const getAllChannels = async (req, res) => {
  try {
    let { userId } = req;
    userId = new mongoose.Types.ObjectId(userId);

    const channels = await Channel.find({
      $or: [{ owner: userId }, { members: userId }],
    })
      .populate(
        "owner",
        "_id firstName lastName email color image isOnline lastOnline"
      )
      .populate(
        "members",
        "_id firstName lastName email color image isOnline lastOnline"
      );

    return res.status(200).json({ channels });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Помилка сервара");
  }
};

export const uploadChannelImage = async (req, res) => {
  try {
    const { channelId } = req.body;

    if (!req.file) {
      return res.status(400).send("Файл не передано");
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "qchat/channel_images",
    });

    const channel = await Channel.findByIdAndUpdate(
      channelId,
      {
        image: result.secure_url,
        imagePublicId: result.public_id,
      },
      { new: true }
    )
      .populate(
        "owner",
        "_id firstName lastName email color image isOnline lastOnline"
      )
      .populate(
        "members",
        "_id firstName lastName email color image isOnline lastOnline"
      );

    return res.status(200).json({ channel, msg: "Зображення завантажено" });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Помилка сервара");
  }
};

export const deleteChannelImage = async (req, res) => {
  try {
    const { channelId } = req.body;
    const channel = await Channel.findByIdAndUpdate(
      channelId,
      {
        image: null,
        imagePublicId: null,
      },
      { new: true }
    )
      .populate(
        "owner",
        "_id firstName lastName email color image isOnline lastOnline"
      )
      .populate(
        "members",
        "_id firstName lastName email color image isOnline lastOnline"
      );
    return res.status(200).json({ channel, msg: "Зображення видалено" });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Помилка сервара");
  }
};

export const updateChannelName = async (req, res) => {
  try {
    const { channelId, newName } = req.body;

    const channel = await Channel.findByIdAndUpdate(
      channelId,
      { name: newName },
      { new: true }
    )
      .populate(
        "owner",
        "_id firstName lastName email color image isOnline lastOnline"
      )
      .populate(
        "members",
        "_id firstName lastName email color image isOnline lastOnline"
      );
    return res.status(200).json({ channel, msg: "Назву каналу оновлено" });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Помилка сервара");
  }
};

export const addChannelMember = async (req, res) => {
  try {
    const { channelId, memberId } = req.body;
    const channel = await Channel.findByIdAndUpdate(
      channelId,
      { $addToSet: { members: memberId } },
      { new: true }
    )
      .populate(
        "owner",
        "_id firstName lastName email color image isOnline lastOnline"
      )
      .populate(
        "members",
        "_id firstName lastName email color image isOnline lastOnline"
      );
    return res.status(200).json({ channel, msg: "Учасника додано до каналу" });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Помилка сервара");
  }
};

export const removeChannelMember = async (req, res) => {};

export const deleteChannel = async (req, res) => {
  try {
    const { channel } = req.body;
    const channelId = channel._id;
    const members = channel.members;

    await Channel.findByIdAndDelete(channelId);

    await Message.deleteMany({ channel: channelId });

    return res
      .status(200)
      .json({ msg: `Канал ${channel.name} видалено`, channelId, members });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Помилка сервара");
  }
};
