import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Form, Input, Button, Card, Spin, Alert, Statistic, Row, Col, Progress, List, Tag, Space } from 'antd';
import { SearchOutlined, UserOutlined, FireOutlined, EyeOutlined, MessageOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { getUserInsights } from '../../utils/Api/adminApi';
import '../../styles/admin.css';

export default function UserInsights() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const userIdFromParams = searchParams.get('userId');
    if (userIdFromParams) {
      form.setFieldValue('userId', userIdFromParams);
      fetchInsights(userIdFromParams);
    }
  }, [searchParams, form]);

  const fetchInsights = async (userId) => {
    setLoading(true);
    try {
      const res = await getUserInsights(userId);
      setData(res.data);
      toast.success('Insights generated');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to generate insights');
    } finally {
      setLoading(false);
    }
  };

  const onSearch = async (values) => {
    fetchInsights(values.userId);
  };

  return (
    <div className="admin-section">
      <h1>User Behavior Insights</h1>

      <Card style={{ marginBottom: 24 }}>
        <Form
          form={form}
          layout="inline"
          onFinish={onSearch}
          style={{ marginBottom: 16 }}
        >
          <Form.Item
            name="userId"
            rules={[{ required: true, message: 'Please enter user ID' }]}
            style={{ flex: 1, minWidth: 200 }}
          >
            <Input placeholder="Enter User ID" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SearchOutlined />}
            >
              Analyze
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {loading && <Spin size="large" style={{ display: 'flex', justifyContent: 'center' }} />}

      {data && data.aiInsights && (
        <div>
          {/* USER STATUS */}
          {data.aiInsights.user_status && (
            <Card style={{ marginBottom: 24, backgroundColor: '#f0f8ff' }}>
              <h3>👤 User Status</h3>
              <Alert
                message={data.aiInsights.user_status}
                type="info"
                showIcon
              />
            </Card>
          )}

          {/* KEY METRICS */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            {data.aiInsights.total_engagement !== undefined && (
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Total Engagement"
                    value={data.aiInsights.total_engagement}
                    prefix={<FireOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
            )}

            {data.aiInsights.activity_level && (
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Activity Level"
                    value={data.aiInsights.activity_level}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
            )}

            {data.aiInsights.last_active_days !== undefined && (
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Days Since Active"
                    value={data.aiInsights.last_active_days}
                    valueStyle={{ color: data.aiInsights.last_active_days > 7 ? '#ff4d4f' : '#52c41a' }}
                  />
                </Card>
              </Col>
            )}

            {data.stats && (
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic
                    title="Total Blogs"
                    value={data.stats?.blogs || 0}
                    prefix={<EyeOutlined />}
                  />
                </Card>
              </Col>
            )}
          </Row>

          {/* BEHAVIOR SUMMARY */}
          {data.aiInsights.behavior_summary && (
            <Card title="📊 Behavior Summary" style={{ marginBottom: 24 }}>
              <p>{data.aiInsights.behavior_summary}</p>
            </Card>
          )}

          {/* MAIN INTERESTS */}
          {data.aiInsights.main_interests && data.aiInsights.main_interests.length > 0 && (
            <Card title="🎯 Main Interests" style={{ marginBottom: 24 }}>
              <Space wrap>
                {data.aiInsights.main_interests.map((interest, idx) => (
                  <Tag key={idx} color="blue" style={{ padding: '6px 12px', fontSize: 12 }}>
                    {interest}
                  </Tag>
                ))}
              </Space>
            </Card>
          )}

          {/* KEY INSIGHTS */}
          {data.aiInsights.key_insights && data.aiInsights.key_insights.length > 0 && (
            <Card title="💡 Key Insights" style={{ marginBottom: 24 }}>
              <List
                dataSource={data.aiInsights.key_insights}
                renderItem={(insight, idx) => (
                  <List.Item key={idx} style={{ paddingLeft: 0 }}>
                    <div style={{
                      padding: 12,
                      backgroundColor: '#fffbe6',
                      borderLeft: '4px solid #faad14',
                      borderRadius: 4,
                      width: '100%'
                    }}>
                      {insight}
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          )}

          {/* STATS IF AVAILABLE */}
          {data.stats && (
            <Card title="📈 Engagement Stats" style={{ marginBottom: 24 }}>
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={8}>
                  <Statistic
                    title="Blog Reads"
                    value={data.stats?.reads || 0}
                    prefix={<EyeOutlined />}
                  />
                </Col>
                <Col xs={12} sm={8}>
                  <Statistic
                    title="Comments Made"
                    value={data.stats?.comments || 0}
                    prefix={<MessageOutlined />}
                  />
                </Col>
                <Col xs={12} sm={8}>
                  <Statistic
                    title="Likes Given"
                    value={data.stats?.likes || 0}
                    prefix={<FireOutlined />}
                  />
                </Col>
              </Row>
            </Card>
          )}
        </div>
      )}

      {!data && !loading && (
        <Alert
          message="Enter a user ID to analyze their behavior patterns, engagement, and interests"
          type="info"
          showIcon
        />
      )}
    </div>
  );
}
