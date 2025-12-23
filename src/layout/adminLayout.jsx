import { Layout, Menu } from 'antd';
import { DashboardOutlined, UserOutlined, FileProtectOutlined, TeamOutlined, BarsOutlined, FileTextOutlined } from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Sider, Content, Header } = Layout;

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/admin/insights',
      icon: <UserOutlined />,
      label: 'User Insights',
    },
    {
      key: '/admin/moderation',
      icon: <FileProtectOutlined />,
      label: 'Moderation Queue',
    },
    {
      key: '/admin/segmentation',
      icon: <TeamOutlined />,
      label: 'User Segmentation',
    },
    {
      key: '/admin/recommendations',
      icon: <BarsOutlined />,
      label: 'Recommendations',
    },
    {
      key: '/admin/reports',
      icon: <FileTextOutlined />,
      label: 'Reports',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth={0}
        theme="dark"
      >
        <div style={{
          height: 60,
          background: 'rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: 16,
          margin: 10
        }}>
          Admin Panel
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={(e) => navigate(e.key)}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ margin: 0 }}>AI-Powered Admin Dashboard</h2>
        </Header>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
