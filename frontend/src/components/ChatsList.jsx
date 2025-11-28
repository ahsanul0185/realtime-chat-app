import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import noAvatar from "../assets/no-profile.svg"
import { formatChatTime } from "../lib/formatChatTime";

const ChatsList = () => {
  const { getAllChatPartners, chats, isUsersLoading, setSelectedUser } =
    useChatStore();
  const {authUser} = useAuthStore();

  useEffect(() => {
    getAllChatPartners();
  }, [getAllChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  if (chats.length === 0) return <NoChatsFound />;

  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat._id}
          className="p-4 rounded-lg cursor-pointer hover:bg-gray-800/40  transition-colors"
          onClick={() => setSelectedUser(chat)}
        >
          <div className="flex items-center gap-3">
            <div
              className="relative shrink-0"
            >
            <span className="z-10 absolute bottom-[0.3px] -right-[0.5px] border-2 border-dark size-3.5 bg-green-500 rounded-full"></span>
              <div className="size-12 rounded-full overflow-hidden">
                <img
                  src={chat.profilePic || noAvatar}
                  alt={chat.fullName}
                />
              </div>
            </div>
            <div className="w-full flex justify-between">
              <div>
                <h4 className="text-slate-200 font-medium truncate">
              {chat.fullName}
            </h4>
            <p className="text-xs text-gray-300">{authUser._id === chat.lastMessage.senderId ? "You: " : ""}{chat.lastMessage.text}</p>
              </div>

              <span className="text-xs text-gray-400">{formatChatTime(chat.lastMessage.createdAt)}</span>
            </div>

          </div>
        </div>
      ))}
    </>
  );
};

export default ChatsList;
