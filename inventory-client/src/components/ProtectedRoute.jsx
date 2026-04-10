import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { useEffect } from 'react'
import { getMeApi } from '../api/auth'

export default function ProtectedRoute({ children, allowedRoles }) {
    const { token, user, setUser } = useAuthStore()

    // Rehydrate user from token on page refresh
    useEffect(() => {
        if (token && !user) {
            getMeApi()
                .then(setUser)
                .catch(() => {})
        }
    }, [token])

    if (!token) {
        return <Navigate to="/login" replace />
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />
    }

    return children
}