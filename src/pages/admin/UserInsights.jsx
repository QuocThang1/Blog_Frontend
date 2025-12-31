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

      {data && (
        <div>
          {/* USER STATUS + SUGGESTION COMBINED */}
          <Card style={{ marginBottom: 24, backgroundColor: '#f0f8ff', borderRadius: 8 }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <h3>👤 User Status</h3>
                <Alert
                  message={data.aiInsights.userStatusAndAdvice || '—'}
                  type={data.aiInsights.segment === 'ACTIVE' ? 'success' : data.aiInsights.segment === 'QUALITY_CONTRIBUTOR' ? 'info' : 'warning'}
                  showIcon
                  style={{ marginTop: 8 }}
                />
              </Col>
              <Col xs={24} md={12}>
                <h3>💡 Suggestion</h3>
                <Alert
                  message={data.aiInsights.engagementInfo || 'Monitor engagement regularly'}
                  type="warning"
                  showIcon
                  style={{ marginTop: 8 }}
                />
              </Col>
            </Row>
          </Card>

          {/* KEY METRICS */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Engagement"
                  value={data.stats?.blogs + data.stats?.comments + data.stats?.likes || 0}
                  prefix={<FireOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="📊 How to Improve"
                  value={data.aiInsights.riskAssessment || 'Post more content'}
                  valueStyle={{ color: '#1890ff', fontSize: 12 }}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Activity Level"
                  value={data.aiInsights.activity_level || 'Not specified'}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Days Inactive"
                  value={data.aiInsights.churnRisk !== undefined ? Math.round(data.aiInsights.churnRisk) + '%' : '—'}
                  valueStyle={{ color: data.aiInsights.churnRisk > 70 ? '#ff4d4f' : '#52c41a' }}
                />
              </Card>
            </Col>
          </Row>

          {/* BEHAVIOR ANALYSIS */}
          <Card title="📋 Behavior Analysis" style={{ marginBottom: 24 }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <h4>Summary:</h4>
                <p>{data.aiInsights.behavior_summary || 'No behavior data available'}</p>
              </Col>
              <Col xs={24} md={12}>
                <h4>⚠️ Advice:</h4>
                <p>{data.aiInsights.activity_advice || 'Continue monitoring engagement'}</p>
              </Col>
            </Row>
          </Card>

          {/* ACTIVITY & RISK ASSESSMENT */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12}>
              <Card>
                <div style={{ paddingBottom: 12 }}>
                  <h4>Activity Level</h4>
                  <p style={{ fontSize: 18, color: '#1890ff', margin: 0 }}>{data.aiInsights.activity_level || 'Not specified'}</p>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card>
                <div style={{ paddingBottom: 12 }}>
                  <h4>⚠️ Risk Assessment</h4>
                  {data.aiInsights.churnRisk !== undefined && (
                    <Progress
                      type="circle"
                      percent={data.aiInsights.churnRisk}
                      width={80}
                      strokeColor={
                        data.aiInsights.churnRisk > 70
                          ? '#ff4d4f'
                          : data.aiInsights.churnRisk > 40
                          ? '#faad14'
                          : '#52c41a'
                      }
                    />
                  )}
                </div>
              </Card>
            </Col>
          </Row>

          {/* KEY INSIGHTS */}
          {data.aiInsights.key_insights && data.aiInsights.key_insights.length > 0 && (
            <Card title="💡 Key Insights" style={{ marginBottom: 24 }}>
              <List
                dataSource={data.aiInsights.key_insights}
                renderItem={(insight, idx) => (
                  <List.Item key={`${insight?.slice(0, 30)}-${idx}`} style={{ paddingLeft: 0 }}>
                    <div
                      style={{
                        padding: 12,
                        backgroundColor: '#fffbe6',
                        borderLeft: '4px solid #faad14',
                        borderRadius: 4,
                        width: '100%'
                      }}
                    >
                      {insight}
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          )}

          {/* MAIN INTERESTS */}
          {data.aiInsights.main_interests && data.aiInsights.main_interests.length > 0 && (
            <Card title="🎯 Main Interests" style={{ marginBottom: 24 }}>
              <Space wrap>
                {data.aiInsights.main_interests.map((interest, idx) => (
                  <Tag key={`${interest}-${idx}`} color="blue" style={{ padding: '6px 12px', fontSize: 12 }}>
                    {interest}
                  </Tag>
                ))}
              </Space>
            </Card>
          )}

          {/* ENGAGEMENT STATS */}
          {data.stats && (
            <Card title="📈 Engagement Stats" style={{ marginBottom: 24 }}>
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={8}>
                  <Statistic title="Blogs" value={data.stats?.blogs || 0} prefix={<EyeOutlined />} />
                </Col>
                <Col xs={12} sm={8}>
                  <Statistic title="Comments" value={data.stats?.comments || 0} prefix={<MessageOutlined />} />
                </Col>
                <Col xs={12} sm={8}>
                  <Statistic title="Likes" value={data.stats?.likes || 0} prefix={<FireOutlined />} />
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
