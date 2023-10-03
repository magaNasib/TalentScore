import useAuth from "./useAuth"
import { axiosPrivateInstance } from "../axioss"

export default function useLogout() {
    const { setUser, setAccessToken, setCSRFToken, accessToken, csrftoken } = useAuth()

    const logout = async () => {
        try {
            const response = await axiosPrivateInstance.post("user/logout/");
            console.log(response);
            
            setAccessToken(null)
            setCSRFToken(null)
            setUser({})
            localStorage.removeItem('access_token')

        } catch (error) {
            console.log(error)
        }
    }

    return logout
}