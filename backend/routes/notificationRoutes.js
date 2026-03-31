const express = require("express");
const router = express.Router();

const {
  getUnread,
  getAll,
  markRead,
} = require("../controllers/notificationController");

router.get("/unread", getUnread);
router.get("/", getAll);
router.put("/:id/read", markRead);

module.exports = router;

