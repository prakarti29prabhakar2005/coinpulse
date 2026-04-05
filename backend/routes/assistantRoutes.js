const express = require("express");
const router = express.Router();
const { askAssistant, analyzeSentiment } = require("../controllers/assistantController");

router.post("/chat", askAssistant);
router.post("/sentiment", analyzeSentiment);

module.exports = router;
