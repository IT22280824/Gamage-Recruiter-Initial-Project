const Contact = require("../models/Contact");

exports.submitMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newMessage = new Contact({
      name,
      email,
      message,
      userId: req.user.id,
    });

    const savedMessage = await newMessage.save();
    res.status(201).json({ message: "Message submitted", data: savedMessage });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyMessages = async (req, res) => {
  try {
    const messages = await Contact.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateMessage = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    if (message.userId.toString() !== req.user.id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    message.message = req.body.message || message.message;
    const updated = await message.save();

    res.status(200).json({ message: "Message updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.deleteMessage = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    if (message.userId.toString() !== req.user.id.toString())
      return res.status(403).json({ message: "Unauthorized" });

    await message.remove();
    res.status(200).json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find().populate("userId", "name email").sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.adminDeleteMessage = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });

    await message.remove();
    res.status(200).json({ message: "Message deleted by admin" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
