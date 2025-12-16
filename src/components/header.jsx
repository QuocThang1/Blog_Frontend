import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { Button, Dropdown, Badge } from "antd";
import { UserOutlined, LogoutOutlined, HomeOutlined, BookOutlined, MessageOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { getUnreadCountApi } from "../utils/Api/chatApi";
import io from "socket.io-client";
import ChatBox from "./chatBox";
import "../styles/header.css";

const Header = () => {
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const socketRef = useRef(null);
    const isChatOpenRef = useRef(false);

    // Keep ref in sync with state
    useEffect(() => {
        isChatOpenRef.current = isChatOpen;
    }, [isChatOpen]);

    // Fetch unread count on mount and setup socket listener
    useEffect(() => {
        if (!auth.isAuthenticated) {
            setUnreadCount(0);
            return;
        }

        // Fetch initial unread count
        const fetchUnreadCount = async () => {
            try {
                const res = await getUnreadCountApi();
                if (res && res.success) {
                    setUnreadCount(res.data.unreadCount);
                }
            } catch (error) {
                console.error("Failed to fetch unread count:", error);
            }
        };
        fetchUnreadCount();

        // Setup socket for real-time unread notifications
        const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
        const token = localStorage.getItem("access_token");

        socketRef.current = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            auth: { token },
            reconnection: true,
            reconnectionDelay: 1000,
        });

        socketRef.current.emit('joinChat');

        // Listen for new messages to update unread count
        socketRef.current.on('newMessage', (message) => {
            // Only increment if chat is closed and message is for current user
            if (!isChatOpenRef.current && message.receiver._id === auth.user._id) {
                setUnreadCount(prev => prev + 1);
            }
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.emit('leaveChat');
                socketRef.current.disconnect();
            }
        };
    }, [auth.isAuthenticated, auth.user._id]);

    // Reset unread count when chat is opened
    const handleOpenChat = () => {
        setIsChatOpen(true);
        // Delay reset to allow user to see the count briefly
        setTimeout(() => setUnreadCount(0), 500);
    };

    // Refresh unread count when chat is closed
    const handleCloseChat = async () => {
        setIsChatOpen(false);
        // Refetch unread count after closing
        try {
            const res = await getUnreadCountApi();
            if (res && res.success) {
                setUnreadCount(res.data.unreadCount);
            }
        } catch (error) {
            console.error("Failed to refresh unread count:", error);
        }
    };

    const handleLogout = () => {
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
        toast.success("Logged out successfully!");
        navigate("/login");
    };

    const userMenuItems = [
        {
            key: "profile",
            icon: <UserOutlined />,
            label: "Profile",
            onClick: () => navigate("/profile"),
        },
        {
            key: "logout",
            icon: <LogoutOutlined />,
            label: "Logout",
            onClick: handleLogout,
        },
    ];

    return (
        <header className="header">
            {/* Left Section - Logo + Menu */}
            <div className="header-left-section">
                {/* Logo */}
                <div className="header-logo" onClick={() => navigate("/")}>
                    <div className="header-logo-icon">
                        <span>13</span>
                    </div>
                    <span className="header-logo-text">GROUP 13</span>
                </div>

                {/* Center Navigation - Home & Blog */}
                <nav className="header-center-nav">
                    <a
                        onClick={() => navigate("/")}
                        className="header-nav-link"
                    >
                        <HomeOutlined style={{ marginRight: 5 }} />
                        Home
                    </a>
                    <a
                        onClick={() => navigate("/blog")}
                        className="header-nav-link"
                    >
                        <BookOutlined style={{ marginRight: 5 }} />
                        Blog
                    </a>
                </nav>
            </div>

            {/* Right Navigation - Auth */}
            <nav className="header-nav">
                {/* Chat Button with Badge */}
                {auth.isAuthenticated && (
                    <Badge count={unreadCount} size="small" offset={[-5, 5]}>
                        <Button
                            type="text"
                            icon={<MessageOutlined />}
                            onClick={handleOpenChat}
                            className="header-chat-button"
                        >
                            Chat
                        </Button>
                    </Badge>
                )}

                {/* Auth Section */}
                {auth.isAuthenticated ? (
                    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                        <Button type="text" className="header-user-button">
                            <UserOutlined /> {auth.user.fullName || auth.user.username}
                        </Button>
                    </Dropdown>
                ) : (
                    <Button
                        onClick={() => navigate("/login")}
                        className="header-get-started-button"
                    >
                        Login
                    </Button>
                )}
            </nav>

            {/* ChatBox Component - pass socket reference */}
            <ChatBox 
                isOpen={isChatOpen} 
                onClose={handleCloseChat} 
                socketRef={socketRef}
            />
        </header>
    );
};

export default Header;