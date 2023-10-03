import axiosInstance, { axiosPrivateInstance } from "../axioss";
import useAuth from "./useAuth";

export default function useRefreshToken() {
    const { setAccessToken, setCSRFToken } = useAuth()

    const refresh = async () => {
        const response = await axiosInstance.post('user/refresh-token/')
        
        setAccessToken(response.data.access)
        setCSRFToken(response.headers["x-csrftoken"])
        localStorage.setItem('access_token',response?.data?.access)


        return { accessToken: response.data.access, csrfToken: response.headers["x-csrftoken"] }
    }

    return refresh
}
