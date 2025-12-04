import Message from "../models/MessageModel.js";

export const getMessages = async (req, res, next) => {
  try {
    const user1 = req.userId;
    const user2 = req.body.id;

    if (!user1 || !user2) {
      return res.status(400).send("Немає ID користувача(-ів)");
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, reciever: user2 },
        { sender: user2, reciever: user1 },
      ],
    }).sort({ timestamp: 1 });

    return res.status(200).json({ messages });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Помилка сервара");
  }
};
