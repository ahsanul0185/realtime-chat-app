import React from 'react'
import { useAuthStore } from '../store/useAuthStore'

const ChatPage = () => {

  const {logout} = useAuthStore();

  return (
    <div>ChatPage


      <button className='bg-amber-500 px-2 py-1 rounded cursor-pointer' onClick={logout}>Logout</button>
    </div>
  )
}

export default ChatPage