import mongoose from "mongoose";

const nofiticationSchema = new mongoose.Schema(
  {
    reciever: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["like", "comment", "connectionAccepted"],
    },
    relatedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    relatedPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  },
  { timestamps: true },
);

const Notification = mongoose.model("Notification", nofiticationSchema);
export default Notification;