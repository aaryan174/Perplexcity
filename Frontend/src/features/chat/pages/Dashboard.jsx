import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'
import { DashboardUI } from '../components/DashboardUI'

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user)

  const {
    chats,
    currentChatId,
    messages,
    isLoading,
    isTyping,
    streamedMsgId,

    initializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleSelectChat,
    handleDeleteChat,
    handleNewChat,
  } = useChat()

  // Initialize socket + fetch chats on mount
  useEffect(() => {
    initializeSocketConnection()
    handleGetChats()
  }, [])

  // Convert chats map to sorted array for sidebar
  const chatHistory = Object.values(chats).sort(
    (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
  )

  return (
    <DashboardUI
      chatHistory={chatHistory}
      activeChatId={currentChatId}
      messages={messages}
      isTyping={isTyping}
      isLoading={isLoading}
      streamedMsgId={streamedMsgId}
      user={user}
      onSendMessage={(message) =>
        handleSendMessage({ message, chatId: currentChatId })
      }
      onNewChat={handleNewChat}
      onSelectChat={handleSelectChat}
      onDeleteChat={handleDeleteChat}
      onSettingsClick={() => console.log("Settings")}
      onProfileClick={() => console.log("Profile")}
    />
  )
}

export default Dashboard
