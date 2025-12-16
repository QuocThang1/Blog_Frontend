import { useState, useContext } from "react";
import { Layout, Menu, Avatar, Typography, Button } from "antd";
import {
    UserOutlined,
    LogoutOutlined,
    HomeOutlined,
    TagsOutlined,
    AppstoreOutlined,
    FileTextOutlined,
    BulbOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { toast } from "react-toastify";

const { Sider } = Layout;
const { Text } = Typography;

const UserSidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
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

    const menuItems = [
        {
            key: "/profile",
            icon: <UserOutlined />,
            label: "Profile",
            onClick: () => navigate("/profile"),
        },
        ...(auth.user.role === "admin"
            ? [
                {
                    key: "/profile/content-management",
                    icon: <BulbOutlined />,
                    label: "Content",
                    onClick: () => navigate("/profile/content-management"),
                },
                {
                    key: "/profile/categories",
                    icon: <AppstoreOutlined />,
                    label: "Category",
                    onClick: () => navigate("/profile/categories"),
                },
                {
                    key: "/profile/tags",
                    icon: <TagsOutlined />,
                    label: "Tag",
                    onClick: () => navigate("/profile/tags"),
                },
                {
                    key: "/profile/blogs",
                    icon: <FileTextOutlined />,
                    label: "Blogs",
                    onClick: () => navigate("/profile/blogs"),
                },
            ] : []),
        {
            key: "logout",
            icon: <LogoutOutlined />,
            label: "Logout",
            onClick: handleLogout,
            danger: true,
        },
    ];

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            className="user-sidebar"
            width={250}
            collapsedWidth={80}
        >
            <div className="sidebar-header">
                <Button
                    type="text"
                    icon={<HomeOutlined />}
                    onClick={() => navigate("/")}
                    className="back-home-button"
                    block
                >
                    {!collapsed && "Back to Home"}
                </Button>
            </div>

            <div className="user-info">
                <Avatar
                    size={collapsed ? 40 : 80}
                    icon={<UserOutlined />}
                    className="user-avatar"
                />
                {!collapsed && (
                    <div className="user-details">
                        <Text className="user-name">
                            {auth.user.fullName || auth.user.username}
                        </Text>
                        <Text className="user-email">{auth.user.email}</Text>
                    </div>
                )}
            </div>

            <Menu
                mode="inline"
                selectedKeys={[location.pathname]}
                items={menuItems}
                className="user-menu"
            />
        </Sider>
    );
};

export default UserSidebar;