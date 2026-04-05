const Notification = require("../models/Notification");

exports.getUnread = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "email is required" });

    const unread = await Notification.find({
      userEmail: email,
      readAt: null,
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ unread });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { email } = req.query;
    const limit = Math.min(Number(req.query.limit) || 100, 200);

    if (!email) return res.status(400).json({ message: "email is required" });

    const notifications = await Notification.find({ userEmail: email })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json({ notifications });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.markRead = async (req, res) => {
  try {
    const { email } = req.query;
    const { id } = req.params;

    if (!email) return res.status(400).json({ message: "email is required" });
    if (!id) return res.status(400).json({ message: "Notification id is required" });

    const updated = await Notification.findOneAndUpdate(
      { _id: id, userEmail: email, readAt: null },
      { readAt: new Date() },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Notification not found" });

    res.json({ message: "Marked as read", notification: updated });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

