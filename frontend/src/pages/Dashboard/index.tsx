import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { useEffect, useRef } from "react"
import { toast } from "sonner"

export default function Dashboard() {

    const { user } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const toastDisparado = useRef(false)

    useEffect(() => {
        const { message, type } = (location.state as any) || {}

        if (message && !toastDisparado.current) {
            toastDisparado.current = true
            if (type === 'success') {
                toast.success(message, {
                    duration: 3000
                })
            } else {
                toast.info(message, {
                    duration: 4000
                })
            }
            navigate(location.pathname, { replace: true, state: null })
        }
    }, [location, navigate])

    return (
        <>
            <h2>Bem Vindo {user?.name}</h2>
        </>

    )
}