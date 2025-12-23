import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Button, Spin, Tag, Space } from 'antd';
import { BarChartOutlined, UserOutlined, FileProtectOutlined, TeamOutlined, FileTextOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { getDashboardSummary, getPlatformStats } from '../../utils/Api/adminApi';
import '../../styles/admin.css';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await getDashboardSummary();
      setStats(res.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }} />;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats?.stats?.totalUsers || 0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Users"
              value={stats?.stats?.activeUsers || 0}
              suffix={`/ ${stats?.stats?.totalUsers || 0}`}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Engagement Rate"
              value={stats?.stats?.engagementRate || 0}
              suffix="%"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Blogs"
              value={stats?.stats?.totalBlogs || 0}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Content Moderation */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card title={<><FileProtectOutlined /> Content Moderation</>} extra={<Button type="primary" href="/profile/moderation">View Queue</Button>}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div><strong>Flagged Content:</strong> {stats?.moderation?.count || 0}</div>
              <div><strong>Approved:</strong> <Tag color="green">{stats?.moderation?.approved || 0}</Tag></div>
              <div><strong>Removed:</strong> <Tag color="red">{stats?.moderation?.removed || 0}</Tag></div>
              <div><strong>Pending Review:</strong> <Tag color="orange">{stats?.moderation?.pending || 0}</Tag></div>
            </Space>
          </Card>
        </Col>

        {/* New Users */}
        <Col xs={24} md={12}>
          <Card title={<><UserOutlined /> New Users</>} extra={<Button type="primary" href="/profile/segmentation">View All</Button>}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div><strong>This Week:</strong> {stats?.newUsers || 0}</div>
              <div style={{ marginTop: 12 }}>
                <Button block onClick={() => window.location.href = '/profile/insights'}>Analyze Users</Button>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Top Content */}
      <Card title={<><BarChartOutlined /> Top Content</>} style={{ marginBottom: 24 }}>
        {stats?.topContent?.length > 0 ? (
          <div className="top-content-list">
            {stats.topContent.map((blog, idx) => (
              <div key={idx} style={{ padding: '12px 0', borderBottom: idx < stats.topContent.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                <strong>{blog.title}</strong>
                <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                  By {blog.author} • {blog.viewCount} views • {blog.likeCount} likes • {blog.commentCount} comments
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No content data available</p>
        )}
      </Card>

      {/* Quick Actions */}
      <Card title={<><FileTextOutlined /> Admin Actions</>}>
        <Row gutter={[12, 12]}>
          <Col xs={12} sm={8} md={4}>
            <Button block href="/profile/insights">User Insights</Button>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Button block href="/profile/moderation">Moderation</Button>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Button block href="/profile/segmentation">Segmentation</Button>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Button block href="/profile/recommendations">Recommendations</Button>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Button block href="/profile/reports">Reports</Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
