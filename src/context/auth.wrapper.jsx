import { useState, useEffect } from "react";
import { getAccountApi } from "../utils/Api/accountApi";
import { Spin } from "antd";
import { AuthContext } from "./auth.context";

export const AuthWrapper = (props) => {
    const [auth, setAuth] = useState({
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

    const [appLoading, setAppLoading] = useState(true);

    useEffect(() => {
        const fetchAccount = async () => {
            const token = localStorage.getItem("access_token");
            if (!token) {
                setAppLoading(false);
                return;
            }

            try {
                const res = await getAccountApi();
                console.log("Account response:", res);
                if (res && res.data) {
                    setAuth({
                        isAuthenticated: true,
                        user: {
                            email: res.data.email || "",
                            fullName: res.data.fullName || "",
                            username: res.data.username || "",
                            dob: res.data.dob || "",
                            gender: res.data.gender || "",
                            phone: res.data.phone || "",
                            role: res.data.role || "user",
                        },
                    });
                } else {
                    localStorage.removeItem("access_token");
                    setAuth({
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
                }
            } catch (error) {
                console.error("Error fetching account:", error);
                localStorage.removeItem("access_token");
                setAuth({
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
            } finally {
                setAppLoading(false);
            }
        };

        fetchAccount();
    }, []);

    return (
        <>
            {appLoading ? (
                <div
                    style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    <Spin size="large" />
                </div>
            ) : (
                <AuthContext.Provider value={{ auth, setAuth, appLoading, setAppLoading }}>
                    {props.children}
                </AuthContext.Provider>
            )}
        </>
    );
};