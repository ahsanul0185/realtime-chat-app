import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import NoChatHistory from "./NoChatHistory";
import { formatChatTime } from "../lib/formatChatTime";
import MessageInput from "./MessageInput";
import MessagesLoadingSkelton from "./MessagesLoadingSkelton";

const ChatContainer = () => {
  const { selectedUser, getMessagesByUserId, messages, isMessagesLoading } =
    useChatStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
  }, [selectedUser, getMessagesByUserId]);

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="space-y-2 text-sm ">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${
                  authUser._id === msg.senderId
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`flex items-end gap-2.5 px-4 py-2 rounded-full max-w-1/2 w-fit ${
                    authUser._id === msg.senderId
                      ? "bg-gray-600/50"
                      : "border border-gray-200/40"
                  }`}
                >
                  <span>{msg.text}</span>

                  <span className={`text-[10px] text-gray-400 `}>
                    {formatChatTime(msg.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : isMessagesLoading ? (
          ""
        ) : (
          <NoChatHistory name={selectedUser.fullName} />
        )}
      </div>
      <MessageInput />
    </>
  );
};

export default ChatContainer;
