import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Form, Input, Button, Card, Spin, Alert, List, Tag, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { getUserRecommendations } from '../../utils/Api/adminApi';
import '../../styles/admin.css';

export default function Recommendations() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const userIdFromParams = searchParams.get('userId');
    if (userIdFromParams) {
      form.setFieldValue('userId', userIdFromParams);
      fetchRecommendations(userIdFromParams);
    }
  }, [searchParams, form]);

  const fetchRecommendations = async (userId) => {
    setLoading(true);
    try {
      const res = await getUserRecommendations(userId);
      setData(res.data);
      toast.success('Recommendations generated');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to generate recommendations');
    } finally {
      setLoading(false);
    }
  };

  const onSearch = async (values) => {
    fetchRecommendations(values.userId);
  };

  return (
    <div className="admin-section">
      <h1>User Recommendations</h1>

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
              Generate
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {loading && <Spin size="large" style={{ display: 'flex', justifyContent: 'center' }} />}

      {data && (
        <div>
          {/* RECOMMENDATION USERS */}
          {data.recommendations?.recommended_users && data.recommendations.recommended_users.length > 0 && (
            <Card title="👥 Recommended Users to Follow" style={{ marginBottom: 24 }}>
              <List
                dataSource={data.recommendations.recommended_users}
                renderItem={(user, idx) => (
                  <List.Item key={idx} style={{ padding: 12, marginBottom: 12, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div>
                        <Tag color="blue" style={{ fontSize: 12 }}>{user.username}</Tag>
                        <span style={{ marginLeft: 12, fontWeight: 'bold' }}>({user.interest})</span>
                      </div>
                      <p style={{ margin: 0, color: '#666', fontSize: 12 }}>Reason: {user.reason}</p>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          )}

          {/* RECOMMENDED TAGS */}
          {data.recommendations?.recommended_tags && data.recommendations.recommended_tags.length > 0 && (
            <Card title="🏷️ Tags to Explore" style={{ marginBottom: 24 }}>
              <Space wrap>
                {data.recommendations.recommended_tags.map((tag, idx) => (
                  <Tag key={idx} color="cyan" style={{ padding: '6px 12px', fontSize: 12 }}>
                    {tag}
                  </Tag>
                ))}
              </Space>
            </Card>
          )}

          {/* TRENDING TOPICS */}
          {data.recommendations?.trending_topics && data.recommendations.trending_topics.length > 0 && (
            <Card title="📈 Trending Topics" style={{ marginBottom: 24 }}>
              <List
                dataSource={data.recommendations.trending_topics}
                renderItem={(topic, idx) => (
                  <List.Item key={idx} style={{ paddingLeft: 0 }}>
                    <Tag color="orange">{topic}</Tag>
                  </List.Item>
                )}
              />
            </Card>
          )}

          {/* SUGGESTION */}
          {data.recommendations?.suggestion && (
            <Alert
              message="Recommendation Suggestion"
              description={data.recommendations.suggestion}
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />
          )}
        </div>
      )}

      {!data && !loading && (
        <Alert
          message="Enter a user ID to generate personalized recommendations"
          type="info"
          showIcon
        />
      )}
    </div>
  );
}
