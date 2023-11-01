import axios from "axios"

// const API_URL = "https://talentscore.pythonanywhere.com/"
const API_URL = "https://web-production-5301.up.railway.app/"
// const API_URL = "http://146.190.122.252/"

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