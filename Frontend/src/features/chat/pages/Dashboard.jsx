import React, { useEffect } from 'react'
import { useChat } from '../hooks/useChat'

const Dashboard = () => {

const chat = useChat()


useEffect(()=>{
    chat.initializeSocketConnection()
},[])

  return (
    <div>
      Dashboard
    </div>
  )
}

export default Dashboard
