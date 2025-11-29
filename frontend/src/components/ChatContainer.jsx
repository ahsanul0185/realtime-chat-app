import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import NoChatHistory from "./NoChatHistory";
import { formatChatTime } from "../lib/formatChatTime";
import MessageInput from "./MessageInput";
import MessagesLoadingSkelton from "./MessagesLoadingSkelton";

const ChatContainer = () => {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
    typingUsers,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();

    // clean up

    return () => unsubscribeFromMessages();
  }, [
    selectedUser,
    getMessagesByUserId,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);


  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, typingUsers]);

  const isSelectedUserTyping = selectedUser && typingUsers ? typingUsers[selectedUser._id] : false;


  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8 custom-scrollbar">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="space-y-4 text-sm ">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${
                  authUser._id === msg.senderId
                    ? "justify-end"
                    : "justify-start"
                } ${
                  msg.text && msg.image && authUser._id === msg.senderId
                    ? "flex-col gap-2 items-end"
                    : msg.text && msg.image
                    ? "flex-col gap-2 items-start"
                    : ""
                }`}
              >
                {msg.text && (
                  <div
                    className={`flex items-end gap-2.5 px-4 py-2 rounded-[20px] max-w-2/3 w-fit ${
                      authUser._id === msg.senderId
                        ? "bg-gray-600/50"
                        : "border border-gray-200/40"
                    } `}
                  >
                    <span>{msg.text}</span>

                    <span
                      className={`text-[10px] text-gray-400 whitespace-nowrap`}
                    >
                      {formatChatTime(msg.createdAt)}
                    </span>
                  </div>
                )}

                {msg.image && (
                  <div
                    className={`flex  flex-col gap-2 rounded-3xl max-w-1/2 w-fit ${
                      authUser._id === msg.senderId
                        ? "items-end"
                        : "items-start"
                    }`}
                  >
                    <img
                      src={msg.image}
                      alt="Shared"
                      className="rounded-lg h-48 object-cover"
                    />

                    <span className={`text-[10px] text-gray-400 `}>
                      {formatChatTime(msg.createdAt)}
                    </span>
                  </div>
                )}
              </div>
            ))}


            {/* Typing Indicator */}
            {isSelectedUserTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-[20px] border border-gray-200/40">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messageEndRef} />
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
