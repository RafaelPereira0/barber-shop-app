import { useAuth } from "../../hooks/useAuth"

export default function Dashboard() {

    const {user} = useAuth()

    return (
        <>
            <h2>Bem Vindo {user?.name}</h2>
        </>

    )
}