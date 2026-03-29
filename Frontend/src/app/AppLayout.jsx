import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { useAuth } from "../features/auth/hooks/useAuth"

export default function AppLayout() {
  const { handleGetMe } = useAuth()

  useEffect(() => {
    handleGetMe()
  }, [])

  return <Outlet />
}
