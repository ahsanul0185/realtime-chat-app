import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import noAvatar from "../assets/no-profile.svg"

const ContactList = () => {

    const { getAllContacts, allContacts, isUsersLoading, setSelectedUser } =
      useChatStore();
  
    useEffect(() => {
      getAllContacts();
    }, [getAllContacts]);
  
    if (isUsersLoading) return <UsersLoadingSkeleton />;
  
    if (allContacts.length === 0) return <NoChatsFound />;

  return (
    <>

{allContacts.map((chat) => (
        <div
          key={chat._id}
          className="p-4 rounded-lg cursor-pointer hover:bg-gray-800/40  transition-colors"
          onClick={() => setSelectedUser(chat)}
        >
          <div className="flex items-center gap-3">
            <div
              className="relative"
            >
            <span className="z-10 absolute bottom-[0.3px] -right-[0.5px] border-2 border-dark size-3.5 bg-green-500 rounded-full"></span>
              <div className="size-12 rounded-full overflow-hidden">
                <img
                  src={chat.profilePic || noAvatar}
                  alt={chat.fullName}
                />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium truncate">
              {chat.fullName}
            </h4>
          </div>
        </div>
      ))}

    </>
  )
}

export default ContactList