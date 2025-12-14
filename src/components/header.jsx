import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { Button, Dropdown } from "antd";
import { UserOutlined, LogoutOutlined, HomeOutlined, BookOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import "../styles/header.css";

const Header = () => {
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);

    const handleLogout = () => {
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
        </header>
    );
};

export default Header;