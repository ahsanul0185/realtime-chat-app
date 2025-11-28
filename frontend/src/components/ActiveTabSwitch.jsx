import React from 'react'
import { useChatStore } from '../store/useChatStore'

const ActiveTabSwitch = () => {
  const {activeTab, setActiveTab} = useChatStore();

  return (
    <div className='p-4 flex items-center gap-8 border-b border-b-gray-400/20'>

      <button onClick={() => setActiveTab("chats")} className='relative cursor-pointer text-gray-200'>
        <span>Chats</span>

        {activeTab === "chats" && <span className='absolute w-1/2 h-[3px] rounded-full bg-primary -bottom-1.5 left-1/2 -translate-x-1/2'></span>}
      </button>

      <button onClick={() => setActiveTab("contacts")} className='relative cursor-pointer text-gray-200'>
        <span>Contacts</span>

        {activeTab === "contacts" && <span className='absolute w-1/2 h-[3px] rounded-full bg-primary -bottom-1.5 left-1/2 -translate-x-1/2'></span>}
      </button>

    </div>
  )
}

export default ActiveTabSwitch