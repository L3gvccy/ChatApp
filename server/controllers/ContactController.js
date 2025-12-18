import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Message from "../models/MessageModel.js";
import ContactsDM from "../models/ContactsDMModel.js";

export const searchContacts = async (req, res, next) => {
  try {
    const { searchTerm } = req.body;

    if (searchTerm === undefined || searchTerm === null) {
      return res.status(400).send("Пошуковий рядок порожній");
    }

    const newSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const regex = new RegExp(newSearchTerm, "i");

    const contacts = await User.find({
      $and: [
        { _id: { $ne: req.userId } },
        { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] },
      ],
    });

    return res.status(200).json({ contacts });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Помилка сервара");
  }
};

export const getContactsDM = async (req, res, next) => {
  try {
    let { userId } = req;
    const id = new mongoose.Types.ObjectId(userId);

    const result = await ContactsDM.findOne({ user: id })
      .populate(
        "contacts.contact",
        "_id firstName lastName email color image isOnline lastOnline"
      )
      .populate("contacts.lastMessage");

    const contacts =
      [...result?.contacts].sort((a, b) => {
        return (
          new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp)
        );
      }) || [];

    return res.status(200).json({ contacts });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Помилка сервара");
  }
};
