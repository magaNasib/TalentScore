import axios from "axios"

const API_URL = "https://qssanalyticstalentscore.pythonanywhere.com/"

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})

 export const axiosPrivateInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})
export default axiosInstance