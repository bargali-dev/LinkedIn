import Notification from "../models/notification.models.js";
export const getNotifications = async (req, res) => {
  try {
    let notification = await Notification.find({ reciever: req.userId })
      .populate("relatedUser", "firstName lastName profileImage")
      .populate("relatedPost", "image  description");
    return res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: `getNotification ${error}` });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    let { id } = req.params;
    await Notification.findByOneAndDelete({
      _id: id,
      reciever: req.userId,
    });
    return res
      .status(200)
      .json({ message: "notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: `deleteNotification ${error}` });
  }
};

export const clearAllNotification = async (req, res) => {
  try {
    await Notification.deleteMany({
      reciever: req.userId,
    });
    return res
      .status(200).json({ message: "notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: `deleteNotification ${error}` });
  }
};