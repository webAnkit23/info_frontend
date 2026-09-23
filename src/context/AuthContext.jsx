import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback
} from "react";

import api, {
    setToken,
    getToken,
    formatApiErrorDetail
} from "@/lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    // null = checking authentication
    // false = not logged in
    // object = logged-in user
    const [user, setUser] = useState(null);

    const [ready, setReady] = useState(false);


    // =====================================================
    // LOAD CURRENT USER
    // =====================================================

    const loadUser = useCallback(async () => {

        // No token -> user is not logged in
        if (!getToken()) {
            setUser(false);
            setReady(true);
            return;
        }

        try {

            const { data } = await api.get("/auth/me");

            setUser(data.user || data);

        } catch (error) {

            console.error("Failed to load user:", error);

            // Token is invalid/expired
            setToken(null);
            setUser(false);

        } finally {

            setReady(true);
        }

    }, []);


    // =====================================================
    // LOAD USER WHEN APP STARTS
    // =====================================================

    useEffect(() => {
        loadUser();
    }, [loadUser]);


    // =====================================================
    // LOGIN
    // =====================================================

    const login = async (identifier, password) => {

        const { data } = await api.post("/auth/login", {
            identifier,
            password
        });

        // Store JWT
        setToken(data.token);

        // Store logged-in user
        setUser(data.user);

        return data.user;
    };


    // =====================================================
    // REGISTER
    // =====================================================

    const register = async (
        name,
        number,
        email,
        password
    ) => {

        const { data } = await api.post("/auth/signup", {
            name,
            number,
            email,
            password
        });

        // Store JWT
        setToken(data.token);

        // Store logged-in user
        setUser(data.user);

        return data.user;
    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const logout = () => {

        setToken(null);

        setUser(false);
    };


    // =====================================================
    // CONTEXT
    // =====================================================

    return (
        <AuthContext.Provider
            value={{
                user,
                ready,
                login,
                register,
                logout,
                loadUser,
                formatApiErrorDetail
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);