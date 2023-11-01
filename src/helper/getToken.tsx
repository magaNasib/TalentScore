import useAuth from 'hooks/useAuth'
import React from 'react'

function getToken() {
let accessToken = localStorage.getItem('access_token')
    
    return accessToken || ''
}

export default getToken