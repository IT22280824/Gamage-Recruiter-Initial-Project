const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController.js");
const { protect } = require("../middlewares/auth.js");

router.post("/", protect, contactController.submitMessage);
router.get("/my-messages", protect, contactController.getMyMessages);
router.put("/:id", protect, contactController.updateMessage);
router.delete("/:id", protect, contactController.deleteMessage);

module.exports = router;
