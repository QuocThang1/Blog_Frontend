import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";
import "../styles/userLayout.css";

const { Content } = Layout;

const UserLayout = () => {
    return (
        <Layout className="user-layout">
            <UserSidebar />

            <Layout style={{ marginLeft: 250 }}>
                <Content className="user-content">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default UserLayout;