import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register, login, getMe, logout } from "../services/auth.api";
import { setUser, setError, setLoading, clearError } from "../Auth.slice";


export function useAuth() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    function handleClearError() {
        dispatch(clearError())
    }

    async function handleRegister({ username, email, password }) {
        try {
            dispatch(setLoading(true))
            await register({ email, username, password })
            navigate("/login")
            return true
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Registration Failed"))
            return false
        } finally {
            dispatch(setLoading(false))
        }
    }
    async function handleLogin({ identifier, password }) {
        try {
            dispatch(setLoading(true))
            const data = await login({ identifier, password })
            dispatch(setUser(data.user))
            navigate("/")
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Login Failed"))
        } finally {
            dispatch(setLoading(false))
        }
    }
    async function handleGetMe() {
        try {
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "GetMe request Failed"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogout() {
        try {
            await logout()
            dispatch(setUser(null))
            navigate("/login")
        } catch (error) {
            console.error(error)
        }
    }

    return {
        handleRegister,
        handleLogin,
        handleGetMe,
        handleClearError,
        handleLogout
    }
}
