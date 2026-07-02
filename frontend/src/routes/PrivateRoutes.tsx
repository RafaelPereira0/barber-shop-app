import { useAuth } from "../hooks/useAuth";
import {Navigate, Outlet} from 'react-router-dom'

export default function PrivateRoute(){
    const { isAuthenticated, loading } = useAuth()

    if(loading){
        return <h2>carregando</h2>
    }

    if(!isAuthenticated){
        return <Navigate to='/login' replace/>
    }

    return <Outlet/>
}