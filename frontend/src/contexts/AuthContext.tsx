import { createContext, useEffect, useState } from "react";
import type { AuthContextData, User } from "../types/auth";
import { login as loginAuth } from "../api/auth.api";

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: { children: React.ReactNode }) {

    const [user, setUser] = useState<User | null>(null);

    const [token, setToken] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!token;

    const login = async (email: string, password: string) => {

    const response = await loginAuth(email, password);


    const { token, user } = response.result;


    setUser(user);
    setToken(token);


    localStorage.setItem("token", token);

    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );
    };

    const logout = () => {

        setUser(null);
        setToken(null);

        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    useEffect(() => {

        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");


        if (
            storedToken &&
            storedUser &&
            storedUser !== "undefined"
        ) {

            setToken(storedToken);
            setUser(JSON.parse(storedUser));

        } else {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

        }


        setLoading(false);

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