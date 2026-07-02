export interface LoginDTO {
    email: string,
    password: string
}

export interface User {

    id: number;
    name: string;
    email: string;
    role: "ADMIN" | "CLIENT" | "BARBER";
}

export interface LoginResponse {

    user: User;
    token: string;
}

export interface AuthContextData {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;

    login(email: string, password: string): Promise<void>;
    logout(): void;
}