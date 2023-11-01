import { useEffect, useState } from "react"
import useAuth from "../hooks/useAuth"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import useAxiosPrivate from "hooks/useAxiosPrivate"
import useRefreshToken from "hooks/useRefreshToken"
import axiosInstance from "axioss"

export default function AuthMiddleware() {
    const { accessToken, setAccessToken } = useAuth()
    const location = useLocation()
    useEffect(() => {
        let isMounted = true

       

        return () => {
            isMounted = false
        }
    }, [])


    return (accessToken ? <Outlet /> : <Navigate to="/" state={{ from: location }} replace />)

}