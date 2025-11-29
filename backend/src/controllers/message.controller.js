import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketId, io } from "../lib/socket.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filterdUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filterdUsers);
  } catch (error) {
    console.error("Error in getAllContacts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessagesByUserId:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;

    const senderId = req.user._id;
    const { id: receiverId } = req.params;

    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required." });
    }
    if (senderId.equals(receiverId)) {
      return res
        .status(400)
        .json({ message: "Cannot send messages to yourself." });
    }
    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: "chat_app/chat_images",
      });
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const recieverSocketId = getRecieverSocketId(receiverId);

    if (recieverSocketId) {
      io.to(recieverSocketId).emit("newMessage", newMessage)
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// export const getChatPartners = async (req, res) => {
//   try {
//     const loggedInUserId = req.user._id;

//     // find all the messages where the logged-in user is either sender or reciever
//     const messages = await Message.find({
//       $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
//     });


//     const chatPartnerIds = [
//       ...new Set(
//         messages.map((msg) =>
//           msg.senderId.toString() === loggedInUserId.toString()
//             ? msg.receiverId.toString()
//             : msg.senderId.toString()
//         )
//       ),
//     ];

//     const chatPartners = await User.find({
//       _id: { $in: chatPartnerIds },
//     }).select("-password");

//     // Attach last message
//     const result = await Promise.all(
//       chatPartners.map(async (partner) => {
//         const lastMsg = await Message.findOne({
//           $or: [
//             { senderId: loggedInUserId, receiverId: partner._id },
//             { senderId: partner._id, receiverId: loggedInUserId },
//           ],
//         })
//           .sort({ createdAt: -1 })
//           // .select("text createdAt senderId receiverId");
//         return {
//           ...partner.toObject(),
//           lastMessage : lastMsg
//         };
//       })
//     );

//     res.status(200).json(result);
//   } catch (error) {
//     console.error("Error in getChatPartners controller:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };


export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id.toString();

    // 1️⃣ Get all messages involving this user (already have full message data)
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    }).sort({ createdAt: -1 }); // sort latest → oldest

    // 2️⃣ Extract chat partner IDs
    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ];

    // 3️⃣ Fetch all partners
    const chatPartners = await User.find({
      _id: { $in: chatPartnerIds },
    }).select("-password");

    // 4️⃣ Build a map of last messages per partner (NO DB CALLS)
    const lastMessageMap = {};

    for (const msg of messages) {
      const partnerId =
        msg.senderId.toString() === loggedInUserId
          ? msg.receiverId.toString()
          : msg.senderId.toString();

      // First occurrence is the latest because messages[] is sorted DESC
      if (!lastMessageMap[partnerId]) {
        lastMessageMap[partnerId] = msg;
      }
    }

    // 5️⃣ Attach last message to partner objects
    const result = chatPartners.map((partner) => ({
      ...partner.toObject(),
      lastMessage: lastMessageMap[partner._id.toString()] || null,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getChatPartners controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
