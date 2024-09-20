const asyncHandler = require("express-async-handler");
const Message = require("../models/message");
const User = require("../models/user");
const Chat = require("../models/chat");

// Send a message
const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    const newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    try {
        let message = await Message.create(newMessage);

        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
            new: true,
        });

        // Emit the new message to the chat room using Socket.io
        const io = req.app.get('io');
        io.to(chatId).emit('newMessage', message);

        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

// Get all messages for a chat
const allMessages = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name pic email")
            .populate("chat");

        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

// Add or update a reaction
const addReaction = asyncHandler(async (req, res) => {
    const { messageId, reaction } = req.body;
    const userId = req.user._id;

    if (!messageId || !reaction) {
        return res.status(400).json({ message: "Invalid data" });
    }

    try {
        // Add or update reaction
        let message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        // Check if user has already reacted
        const existingReaction = message.reactions.find(r => r.userId.toString() === userId.toString());

        if (existingReaction) {
            // Update existing reaction
            existingReaction.reaction = reaction;
        } else {
            // Add new reaction
            message.reactions.push({ userId, reaction });
        }

        await message.save();

        // Populate the reactions with user data
        message = await message.populate("reactions.userId", "name pic");

        // Emit the updated reaction to the chat room using Socket.io
        const io = req.app.get('io');
        io.to(message.chat).emit('updatedReaction', message);

        res.json(message);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = { sendMessage, allMessages, addReaction };
