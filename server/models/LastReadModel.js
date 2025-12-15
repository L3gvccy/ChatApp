import mongoose from "mongoose";

const lastReadSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channels",
    required: false,
    default: null,
  },
  contactId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: false,
    default: null,
  },
  messageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Messages",
    required: true,
  },
});

const LastRead = mongoose.model("LastReads", lastReadSchema);
export default LastRead;
