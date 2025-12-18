import mongoose from "mongoose";

const channelSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  color: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    default: null,
  },
  imagePublicId: {
    type: String,
    required: false,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  lastActivity: {
    type: Date,
    default: Date.now,
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Messages",
    default: null,
  },
});

const Channel = mongoose.model("Channels", channelSchema);

export default Channel;
