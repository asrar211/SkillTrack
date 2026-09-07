import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import { authApi } from "./api/auth.api";
import type {
    LoginPayload,
    RegisterPayload,
    User,
} from "./auth.types";

interface AuthContextValue {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (payload: LoginPayload) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => void;
}

const AuthContext =
    createContext<AuthContextValue | undefined>(
        undefined
    );

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({
    children,
}: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const response = await authApi.me();

                setUser(response.data);
            } catch {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        restoreSession();
    }, []);

    const login = async (
        payload: LoginPayload
    ) => {
        const response = await authApi.login(payload);

        setUser(response.data);
    };

    const register = async (
        payload: RegisterPayload
    ) => {
        const response = await authApi.register(payload);

        setUser(response.data);
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: Boolean(user),
                isLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}