import { createContext, useEffect, useState } from "react";
import type { AuthContextData, User } from "../types/auth";
import { login as loginAuth } from "../api/auth.api";
import { setAccessToken } from "../api/token";
import { api } from "../api/axios";

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!token;

    const login = async (email: string, password: string) => {

        const response = await loginAuth(email, password);

        const { token, user } = response;


        setUser(user);
        setToken(token);
        setAccessToken(token)

    };

    const logout = async () => {
        await api.post('/login/logout')

        setUser(null);
        setToken(null);
        setAccessToken(null)
    };

    async function restore() {
        try {
            const response = await api.post('/login/refresh')

            const { accessToken, user } = response.data;

            setToken(accessToken)
            setAccessToken(accessToken)
            setUser(user)
        } catch {
            setUser(null);
            setToken(null);
            setAccessToken(null)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        restore()
    }, []);

    useEffect(() => {

        const handleLogout = () => {
            logout();
        };

        window.addEventListener("logout", handleLogout);

        return () => {
            window.removeEventListener("logout", handleLogout);
        };

    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                isAuthenticated,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}