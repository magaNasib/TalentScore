import { useContext, useDebugValue } from "react";
import AuthContext from "../store/auth-context"
export  interface AuthContextType {
    
        user: {
            first_name:string,
            last_name:string,
            report_test:boolean,
            email:string,
            
        }; // Adjust this according to your actual context structure
        setUser: (user:any) => void;
        accessToken: null;
        refreshToken: null;
        csrftoken: null;
        setAccessToken: (accessToken:any) => void;
        setRefreshToken: (refreshToken:any)=>void;
        setCSRFToken: (csrfToken:any) => void;
    

}
export default function useAuth() {
    const  auth  = useContext(AuthContext)
    useDebugValue(auth, auth => auth?.user ? "Logged In" : "Logged Out")

    return useContext(AuthContext)
}