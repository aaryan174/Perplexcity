import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'
import { DashboardUI } from '../components/DashboardUI'

const Dashboard = () => {
  const chat = useChat()
  const user = useSelector((state) => state.auth.user)

  useEffect(() => {
    chat.initializeSocketConnection()
  }, [])

  return (
    <DashboardUI
      chatHistory={[]}
      activeChatId={null}
      user={user}
      onSendMessage={(message) => console.log("Send:", message)}
      onNewChat={() => console.log("New chat")}
      onSelectChat={(id) => console.log("Select chat:", id)}
      onDeleteChat={(id) => console.log("Delete chat:", id)}
      onSettingsClick={() => console.log("Settings")}
      onProfileClick={() => console.log("Profile")}
    />
  )
}

export default Dashboard
