const express = require("express");
const router = express.Router();
const {
  getAllMessages,
  adminDeleteMessage
} = require("../controllers/contactController.js");

const { protect, adminOnly } = require('../middlewares/auth.js');

router.use(protect);
router.use(adminOnly);

router.get("/", getAllMessages);
router.delete("/:id", adminDeleteMessage);

module.exports = router;
