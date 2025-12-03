import { createContext } from "react";

export const AuthContext = createContext({
    isAuthenticated: false,
    user: {
        email: "",
        fullName: "",
        username: "",
        dob: "",
        gender: "",
        phone: "",
        role: "",
    },
});