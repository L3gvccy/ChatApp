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
});

const Channel = mongoose.model("Channels", channelSchema);

export default Channel;
