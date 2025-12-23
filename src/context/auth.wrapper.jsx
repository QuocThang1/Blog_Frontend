import { useState, useEffect } from "react";
import { getAccountApi } from "../utils/Api/accountApi";
import Spinner from "../components/spinner";
import FavoriteCategoriesModal from "../components/FavoriteCategoriesModal";
import { AuthContext } from "./auth.context";

export const AuthWrapper = (props) => {
    const [auth, setAuth] = useState({
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

    const [appLoading, setAppLoading] = useState(true);
    const [showTopicsModal, setShowTopicsModal] = useState(false);

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
                            _id: res.data._id || "",
                            email: res.data.email || "",
                            fullName: res.data.fullName || "",
                            username: res.data.username || "",
                            dob: res.data.dob || "",
                            gender: res.data.gender || "",
                            phone: res.data.phone || "",
                            role: res.data.role || "user",
                            categories: res.data.categories || [],
                        },
                    });

                    // If user has no chosen categories, prompt them (every login until they pick)
                    if (!res.data.categories || res.data.categories.length === 0) {
                        setShowTopicsModal(true);
                    } else {
                        setShowTopicsModal(false);
                    }
                } else {
                    localStorage.removeItem("access_token");
                    setAuth({
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
                        },
                    });
                }
            } catch (error) {
                console.error("Error fetching account:", error);
                localStorage.removeItem("access_token");
                setAuth({
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
                <div className="loading">
                    <Spinner />
                </div>
            ) : (
                <AuthContext.Provider value={{ auth, setAuth, appLoading, setAppLoading, refreshAccount: async () => {
                        try {
                            const res = await getAccountApi();
                            if (res && res.data) {
                                setAuth({
                                    isAuthenticated: true,
                                    user: {
                                        _id: res.data._id || "",
                                        email: res.data.email || "",
                                        fullName: res.data.fullName || "",
                                        username: res.data.username || "",
                                        dob: res.data.dob || "",
                                        gender: res.data.gender || "",
                                        phone: res.data.phone || "",
                                        role: res.data.role || "user",
                                        categories: res.data.categories || [],
                                    },
                                });

                                if (!res.data.categories || res.data.categories.length === 0) {
                                    setShowTopicsModal(true);
                                } else {
                                    setShowTopicsModal(false);
                                }
                            }
                        } catch (err) {
                            console.error('Failed to refresh account:', err);
                        }
                    } }}>
                    {props.children}
                    <FavoriteCategoriesModal
                        open={showTopicsModal}
                        onClose={() => setShowTopicsModal(false)}
                        onSaved={async () => { await (async () => {
                            try {
                                const res = await getAccountApi();
                                if (res && res.data) {
                                    setAuth({
                                        isAuthenticated: true,
                                        user: {
                                            _id: res.data._id || "",
                                            email: res.data.email || "",
                                            fullName: res.data.fullName || "",
                                            username: res.data.username || "",
                                            dob: res.data.dob || "",
                                            gender: res.data.gender || "",
                                            phone: res.data.phone || "",
                                            role: res.data.role || "user",
                                            categories: res.data.categories || [],
                                        },
                                    });

                                    if (!res.data.categories || res.data.categories.length === 0) {
                                        setShowTopicsModal(true);
                                    } else {
                                        setShowTopicsModal(false);
                                    }
                                }
                            } catch (err) {
                                console.error('Failed to refresh account after save:', err);
                            }
                        })(); setShowTopicsModal(false); }}
                        initialSelected={auth?.user?.categories || []}
                    />
                </AuthContext.Provider>
            )}
        </>
    );
};