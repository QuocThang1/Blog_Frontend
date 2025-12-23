import { createContext } from "react";

export const AuthContext = createContext({
    isAuthenticated: false,
    user: {
        _id: "",
        email: "",
        fullName: "",
        username: "",
        dob: "",
        gender: "",
        phone: "",
        role: "",
        categories: [],
    },
});