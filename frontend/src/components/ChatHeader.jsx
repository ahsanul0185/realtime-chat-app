import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import noAvatar from "../assets/no-profile.svg";
import { XIcon } from "lucide-react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();

  useEffect(() => {
    const handleEscKey = (e) => {
        if(e.key === "Escape") setSelectedUser(null);
    }
    window.addEventListener("keydown", handleEscKey)
    return () => window.removeEventListener("keydown", handleEscKey)
  }, [setSelectedUser])
  

  return (
    <div className="flex justify-between items-center border-b border-b-gray-200/20 max-h-[84px] px-6 flex-1">
      <div className="flex justify-between items-center w-full">
        <div className="flex gap-3 items-center">
          <div className="h-10 relative group shrink-0">
            <span className="z-10 absolute group-hover:opacity-0 group-hover:scale-0 duration-200 -bottom-[0.2px] -right-[3px] border-2 border-dark size-3.5 bg-green-500 rounded-full"></span>
            <button className="size-10 rounded-full overflow-hidden relative">
              <img
                src={selectedUser.profilePic || noAvatar}
                alt={selectedUser.fullName}
                className="w-full h-full object-cover"
              />
            </button>
          </div>

          <div>
            <h3 className="text-slate-200 font-medium text-sm max-w-[180px] truncate">
              {selectedUser.fullName}
            </h3>

            <p className="text-slate-400 text-[11px]">Online</p>
          </div>
        </div>

                <button onClick={() => setSelectedUser(null)}>
        <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
      </button>
      </div>
    </div>
  );
};

export default ChatHeader;
