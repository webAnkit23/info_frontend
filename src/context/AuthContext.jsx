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


// =====================================================
// CREATE AUTH CONTEXT
// =====================================================

const AuthContext = createContext(null);


// =====================================================
// AUTH PROVIDER
// =====================================================

export const AuthProvider = ({ children }) => {

    /*
        user states:

        null   -> checking authentication
        false  -> user is not logged in
        object -> logged-in user
    */

    const [user, setUser] = useState(null);

    const [ready, setReady] = useState(false);


    // =====================================================
    // LOAD CURRENT USER
    // =====================================================

    const loadUser = useCallback(async () => {

        // Get JWT from storage
        const token = getToken();

        // No token -> user is not logged in
        if (!token) {

            setUser(false);

            setReady(true);

            return;
        }


        try {

            // Ask backend for logged-in user
            const { data } = await api.get(
                "/auth/me"
            );


            // Backend returns:
            //
            // {
            //     user: {
            //         id,
            //         userId,
            //         name,
            //         number,
            //         email
            //     }
            // }

            setUser(
                data.user || data
            );

        } catch (error) {

            console.error(
                "Failed to load user:",
                error
            );


            // Token may be expired or invalid
            setToken(null);


            // Mark user logged out
            setUser(false);

        } finally {

            setReady(true);
        }

    }, []);


    // =====================================================
    // LOAD USER WHEN APPLICATION STARTS
    // =====================================================

    useEffect(() => {

        loadUser();

    }, [loadUser]);


    // =====================================================
    // LOGIN
    // =====================================================

    const login = async (
        identifier,
        password
    ) => {

        /*
            identifier can be:

            Email:
            student@gmail.com

            OR

            Roll Number / User ID:
            10612345
        */

        const { data } = await api.post(
            "/auth/login",
            {
                identifier,
                password
            }
        );


        // =========================
        // STORE JWT
        // =========================

        setToken(
            data.token
        );


        // =========================
        // STORE USER
        // =========================

        setUser(
            data.user
        );


        // Return user to Login component
        return data.user;
    };


    // =====================================================
    // REGISTER / SIGNUP
    // =====================================================

    const register = async (
        name,
        userId,
        number,
        email,
        password
    ) => {

        /*
            userId is now the student's
            Roll Number.

            Example:

            userId = "10612345"
        */


        const { data } = await api.post(
            "/auth/signup",
            {
                userId,
                name,
                number,
                email,
                password
            }
        );


        /*
            Backend response:

            {
                message: "User created successfully",

                token: "...",

                user: {
                    id: "...",
                    userId: "10612345",
                    name: "Ankit Singh",
                    number: "9876543210",
                    email: "..."
                }
            }
        */


        // =========================
        // STORE JWT
        // =========================

        setToken(
            data.token
        );


        // =========================
        // STORE USER
        // =========================

        setUser(
            data.user
        );


        // Return newly created user
        return data.user;
    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const logout = () => {

        // Remove JWT
        setToken(null);


        // Mark user logged out
        setUser(false);
    };


    // =====================================================
    // AUTH CONTEXT VALUE
    // =====================================================

    const value = {

        // Current user
        user,

        // Authentication loading completed
        ready,

        // Authentication functions
        login,
        register,
        logout,
        loadUser,

        // API error formatter
        formatApiErrorDetail
    };


    // =====================================================
    // PROVIDER
    // =====================================================

    return (

        <AuthContext.Provider
            value={value}
        >

            {children}

        </AuthContext.Provider>

    );
};


// =====================================================
// USE AUTH HOOK
// =====================================================

export const useAuth = () => {

    const context = useContext(
        AuthContext
    );


    // Prevent useAuth outside AuthProvider
    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }


    return context;
};