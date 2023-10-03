import { useState, createContext } from 'react'

import {AuthContextType} from './../hooks/useAuth'
export const AuthContext = createContext<AuthContextType>({
    user: {first_name:'',last_name:'',report_test:false,email:''},
    setUser: () => { },
    accessToken: null,
    refreshToken: null,
    csrftoken: null,
    setAccessToken: () => { },
    setRefreshToken: () => { },
    setCSRFToken: () => { }
})

export function AuthContextProvider(props:any) {
    const [user, setUser] = useState({first_name:'',last_name:'',report_test:false,email:''
    
    }); 
    const [accessToken, setAccessToken] = useState(null); 
    const [refreshToken, setRefreshToken] = useState(null); 
    const [csrftoken, setCSRFToken] = useState(null); 

    
    return <AuthContext.Provider value={{
        user, setUser,
        accessToken, setAccessToken,
        refreshToken, setRefreshToken,
        csrftoken, setCSRFToken
    }}>
        {props.children}
    </AuthContext.Provider>
}

export default AuthContext