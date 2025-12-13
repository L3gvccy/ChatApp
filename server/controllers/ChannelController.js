import mongoose from "mongoose";
import Channel from "../models/ChannelModel.js";
import { v2 as cloudinary } from "cloudinary";

export const getAllChannels = async (req, res) => {
  try {
    let { userId } = req;
    userId = new mongoose.Types.ObjectId(userId);

    const channels = await Channel.find({
      $or: [{ owner: userId }, { members: userId }],
    });

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
    );
    return res.status(200).json({ channel, msg: "Назву каналу оновлено" });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Помилка сервара");
  }
};
