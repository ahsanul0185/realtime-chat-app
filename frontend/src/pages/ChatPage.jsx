import React, { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useChatStore } from '../store/useChatStore';
import BorderAnimatedContainer from '../components/BorderAnimatedContainer';
import ProfileHeader from '../components/ProfileHeader';
import ActiveTabSwitch from '../components/ActiveTabSwitch';
import ContactList from '../components/ContactList';
import ChatsList from '../components/ChatsList';
import ChatContainer from '../components/ChatContainer';
import NoConversation from '../components/NoConversation';

const ChatPage = () => {

  const {logout} = useAuthStore();
  const {getAllContacts, activeTab, selectedUser} = useChatStore();

  useEffect(() => {
    getAllContacts()
  },[])

  return (
    <div className="relative w-full max-w-6xl flex h-[800px] rounded-2xl border border-gray-200/20 bg-linear-to-br from-slate-900 via-neutral-950 to-black">
      {/* LEFT SIDE */}
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
  )
}

export default ChatPage