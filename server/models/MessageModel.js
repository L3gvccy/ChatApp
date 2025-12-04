import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  reciever: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: false,
  },
  type: {
    type: String,
    enum: ["text", "file"],
    required: true,
  },
  content: {
    type: String,
    required: function () {
      return this.type === "text";
    },
  },
  fileUrl: {
    type: String,
    required: function () {
      return this.type === "file";
    },
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Messages", messageSchema);

export default Message;
