import React, { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useChatStore } from '../store/useChatStore';
import ProfileHeader from '../components/ProfileHeader';
import ActiveTabSwitch from '../components/ActiveTabSwitch';
import ContactList from '../components/ContactList';
import ChatsList from '../components/ChatsList';
import ChatContainer from '../components/ChatContainer';
import NoConversation from '../components/NoConversation';

const ChatPage = () => {
  
  const {activeTab, selectedUser} = useChatStore();

  return (
<>

    <div className="hidden relative w-full max-w-6xl md:flex h-[800px] rounded-2xl border border-gray-200/20 bg-linear-to-br from-slate-900 via-neutral-950 to-black">
      {/* SIDEBAR */}
      <div className="w-80 border-r h-full border-r-gray-200/20 flex flex-col">
        <ProfileHeader/>
        <ActiveTabSwitch />

        <div className="flex-1 overflow-y-auto p-1.5 space-y-2">
          {activeTab === "chats" ? <ChatsList /> : <ContactList />}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? <ChatContainer /> : <NoConversation/>}
      </div>
    </div>


        <div className="md:hidden relative w-full flex h-screen bg-linear-to-br from-slate-900 via-neutral-950 to-black">

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? <ChatContainer /> :       <div className="w-full h-full flex flex-col">
        <ProfileHeader/>
        <ActiveTabSwitch />

        <div className="flex-1 overflow-y-auto p-1.5 space-y-2">
          {activeTab === "chats" ? <ChatsList /> : <ContactList />}
        </div>
      </div>}
      </div>
    </div>

</>
  )
}

export default ChatPage