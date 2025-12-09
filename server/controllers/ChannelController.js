import mongoose from "mongoose";
import Channel from "../models/ChannelModel.js";

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
