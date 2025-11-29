// import { create } from "zustand";
// import { axiosInstance } from "../lib/axios";
// import toast from "react-hot-toast";
// import { useAuthStore } from "./useAuthStore";



// export const useChatStore = create((set, get) => ({
//   allContacts: [],
//   chats: [],
//   messages: [],
//   activeTab: "chats",
//   selectedUser: null,
//   isUsersLoading: false,
//   isMessagesLoading: false,
//   isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,
//   typingUsers: {}, // {userId: boolean}

//   toggleSound: () => {
//     localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
//     set({ isSoundEnabled: !get().isSoundEnabled });
//   },

//   setActiveTab: (tab) => set({ activeTab: tab }),
//   setSelectedUser: (selectedUser) => set({ selectedUser }),

//   getAllContacts: async () => {
//     set({ isUsersLoading: true });
//     try {
//       const res = await axiosInstance.get("/messages/contacts");
//       set({ allContacts: res.data });
//     } catch (error) {
//       toast.error(error.response.data.message);
//     } finally {
//       set({ isUsersLoading: false });
//     }
//   },

//   getAllChatPartners: async () => {
//     set({ isUsersLoading: true });
//     try {
//       const res = await axiosInstance.get("/messages/chats");
//       set({ chats: res.data });
//     } catch (error) {
//       toast.error(error.response.data.message);
//     } finally {
//       set({ isUsersLoading: false });
//     }
//   },

//   getMessagesByUserId : async (userId) => {
//     set({isMessagesLoading : true});
//     try {
//       const res = await axiosInstance.get(`/messages/${userId}`);
//       set({messages : res.data})
//     } catch (error) {
//       console.log(error?.response?.data?.message);
//       toast.error(error?.response?.data?.message || "Something went wrong");
//     }finally {
//       set({isMessagesLoading : false})
//     }
//   },
  

//   sendMessage : async (messageData) => {
//     const {selectedUser, messages} = get();
//     const { authUser } = useAuthStore.getState();

//     const tempId = `temp-${Date.now()}`;
    
//     const optimisticMessage = {
//       _id : tempId,
//       senderId : authUser._id,
//       reciverId : selectedUser._id,
//       text : messageData.text,
//       image : messageData.image,
//       createdAt : new Date().toISOString(),
//       isOptimistic : true // to identify optimistic messages
//     }
//     // immidiately update the ui
//     set({messages : [...messages, optimisticMessage]})

//     try {
//       const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
//       set({messages : messages.concat(res.data)})
//     } catch (error) {
//       console.log(error?.response?.data?.message);
//       // removes optimistic message
//       set({messages : messages})
//       toast.error(error?.response?.data?.message || "Something went wrong");
//     }
//   },

  
//   // Emit typing event
//   emitTyping: (receiverId) => {
//     const socket = useAuthStore.getState().socket;
//     if (socket && receiverId) {
//       socket.emit("userTyping", { receiverId });
//     }
//   },

//   // Emit stopped typing event
//   emitStoppedTyping: (receiverId) => {
//     const socket = useAuthStore.getState().socket;
//     if (socket && receiverId) {
//       socket.emit("userStoppedTyping", { receiverId });
//     }
//   },


//   subscribeToMessages : () => {
//     const {selectedUser, isSoundEnabled} = get();

//     if (!selectedUser) return

//     const socket = useAuthStore.getState().socket;

//     socket.on("newMessage", (newMessage) => {

//       const isMessageSentFromSelectedUser = newMessage.senderId ===  selectedUser._id;
//       if (!isMessageSentFromSelectedUser) return

//       const currentMessages = get().messages;
//       set({messages : [...currentMessages, newMessage]});

//       const updatedChats = get().chats.map(chat => {
//         if (chat._id === selectedUser._id) {
//           return {...chat, lastMessage : newMessage}
//         }
//         return chat
//       })

//       set({chats : updatedChats})

//       if (isSoundEnabled) {
//         const notificationSound = new Audio("/sounds/notification.mp3")
//         notificationSound.currentTime = 0; // reset ot start
//         notificationSound.play().catch(e => console.log("Audio play failed: ", e));
//       }
//     })
//   },

//   unsubscribeFromMessages : () => {
//     const socket = useAuthStore.getState().socket;
//     socket.off("newMessage")
//   }
  
// }));


import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,
  typingUsers: {}, // {userId: boolean}

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getAllChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      console.log(error?.response?.data?.message);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      reciverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };
    // immediately update the ui
    set({ messages: [...messages, optimisticMessage] });

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: messages.concat(res.data) });
    } catch (error) {
      console.log(error?.response?.data?.message);
      // remove optimistic message
      set({ messages: messages });
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  },

  // Emit typing event
  emitTyping: (receiverId) => {
    const socket = useAuthStore.getState().socket;
    if (socket && receiverId) {
      socket.emit("userTyping", { receiverId });
    }
  },

  // Emit stopped typing event
  emitStoppedTyping: (receiverId) => {
    const socket = useAuthStore.getState().socket;
    if (socket && receiverId) {
      socket.emit("userStoppedTyping", { receiverId });
    }
  },

  subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get();

    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      const currentMessages = get().messages;
      set({ messages: [...currentMessages, newMessage] });

      const updatedChats = get().chats.map((chat) => {
        if (chat._id === selectedUser._id) {
          return { ...chat, lastMessage: newMessage };
        }
        return chat;
      });

      set({ chats: updatedChats });

      if (isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3");
        notificationSound.currentTime = 0;
        notificationSound.play().catch((e) => console.log("Audio play failed: ", e));
      }
    });

    // Listen for typing events
    socket.on("userTyping", ({ senderId }) => {
      set((state) => ({
        typingUsers: { ...state.typingUsers, [senderId]: true },
      }));
    });

    socket.on("userStoppedTyping", ({ senderId }) => {
      set((state) => ({
        typingUsers: { ...state.typingUsers, [senderId]: false },
      }));
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("userTyping");
    socket.off("userStoppedTyping");
  },
}));