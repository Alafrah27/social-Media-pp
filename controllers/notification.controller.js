import Notification from "../model/notification.model.js";

export async function getUserNotifications(req, res) {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .populate("relatedUser", "name username profilepicture")
      .populate("relatedPost", "content image");
    res.status(200).json(notifications);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function markNotificationAsRead(req, res) {
  const notificationId = req.params.id;
  try {
    const notification = await Notification.findByIdAndUpdate(
      { _id: notificationId, recipient: req.user._id },
      { read: true },
      { new: true }
    );

    res.status(200).json(notification);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteNotification(req, res) {
  const notificationId = req.params.id;
  try {
    const notification = await Notification.findByIdAndDelete({
      _id: notificationId,
      recipient: req.user._id,
    });
    res.status(200).json(notification);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
