import App from 'App'
import useAuth from 'hooks/useAuth'
import useAxiosPrivate from 'hooks/useAxiosPrivate'
import useRefreshToken from 'hooks/useRefreshToken'
import Home from 'pages/Home'
import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'


export default function PersistLogin() {
    

    const refresh = useRefreshToken()
    const { accessToken, setUser } = useAuth()
    const [loading, setLoading] = useState(true)
    const axiosPrivate = useAxiosPrivate()

    useEffect(() => {
        let isMounted = true

        async function verifyUser() {
            try {
                await refresh()
                const { data } = await axiosPrivate.get('user/user/')
                setUser(data)
            } catch (error) {
                console.log(error)
            } finally {
                isMounted && setLoading(false)
            }
        }

        !accessToken ? verifyUser() : setLoading(false)

        return () => {
            isMounted = false
        }
    }, [])

    return (
        loading ? "Loading" : <Outlet />
    )
}