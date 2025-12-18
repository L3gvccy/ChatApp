import mongoose from "mongoose";

const contactsDMSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  contacts: [
    {
      contact: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
      lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Messages",
        default: null,
      },
    },
  ],
});

const ContactsDM = mongoose.model("contactsDM", contactsDMSchema);
export default ContactsDM;
