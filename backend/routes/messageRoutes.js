const express = require("express");
const { sendMessage, allMessages, addReaction } = require("../controllers/messageController");
const { protect } = require("../middlewares/authenticationMiddleware");

const router = express.Router();

router.route("/").post(protect, sendMessage); // Ensure sendMessage is imported and defined
router.route("/:chatId").get(protect, allMessages); // Ensure allMessages is imported and defined
router.route("/reaction").post(protect, addReaction); // Ensure addReaction is imported and defined

module.exports = router;
