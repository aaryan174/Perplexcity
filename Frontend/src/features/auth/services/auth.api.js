import axios from "axios";

const api =  axios.create({
    baseURL: "",
    withCredentials: true
})


export async function register({username, email, password}) {
    const res = await api.post("/api/auth/register",{
        username, 
        email,
        password
    })
    return res.data;
}

 export async function login({identifier, password}) {
    const res = await api.post("/api/auth/login",{
        identifier,
        password
    })
    return res.data
}

export async function getMe() {
    const res = await api.get("/api/auth/get-me")
    return res.data
}

export async function logout() {
    const res = await api.post("/api/auth/logout")
    return res.data
}