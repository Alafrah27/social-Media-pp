import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema(
  {
    // recipient of the notification 
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      // type of notification like, comment, connectionAccepted
      type: String,
      required: true,
      enum: ["like", "comment", "connectionAccepted"],
    },
    relatedUser: {
      // related user who send the notification
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    relatedPost: {
      // related post who received the notification
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
