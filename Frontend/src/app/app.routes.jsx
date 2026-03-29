import { createBrowserRouter } from "react-router-dom"
import Login from "../features/auth/pages/Login"
import Register from "../features/auth/pages/Register"
import AppLayout from "./AppLayout"
import Protected from "../features/auth/components/Protected"
import Dashboard from "../features/chat/pages/Dashboard"

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/",
        element: <Protected><Dashboard /></Protected>,
      },
    ],
  },
])
