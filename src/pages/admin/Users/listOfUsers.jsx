import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Tag, Space, Button, Input, Popconfirm, Empty, Tooltip, Modal, Spin, Row, Col, Card, List, Avatar, Divider, Alert, Statistic } from "antd";
import { EditOutlined, DeleteOutlined, SearchOutlined, BarChartOutlined, CheckCircleOutlined, FireOutlined, EyeOutlined, MessageOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { getAllUsersApi } from "../../../utils/Api/userAPI";
import { getUserInsights, getUserRecommendations } from "../../../utils/Api/adminApi";
import "../../../styles/adminManagement.css";

const ListOfUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  
  // Modal states
  const [insightsModalOpen, setInsightsModalOpen] = useState(false);
  const [recommendationsModalOpen, setRecommendationsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [insightsData, setInsightsData] = useState(null);
  const [recommendationsData, setRecommendationsData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsersApi();
      if (res?.EC === 0) {
        setUsers(res.data || []);
      } else {
        toast.error(res.EM);
      }
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenInsightsModal = async (userId) => {
    setSelectedUserId(userId);
    setModalLoading(true);
    try {
      const res = await getUserInsights(userId);
      setInsightsData(res.data);
      setInsightsModalOpen(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to generate insights');
    } finally {
      setModalLoading(false);
    }
  };

  const handleOpenRecommendationsModal = async (userId) => {
    setSelectedUserId(userId);
    setModalLoading(true);
    try {
      const res = await getUserRecommendations(userId);
      setRecommendationsData(res.data);
      setRecommendationsModalOpen(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to generate recommendations');
    } finally {
      setModalLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(searchText.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "No",
      render: (_, __, index) => index + 1,
      width: 60,
      align: "center",
    },
    {
      title: "Username",
      dataIndex: "username",
    },
    {
        title: "Birthday",
        dataIndex: "dob",
        render: (d) => d ? new Date(d).toLocaleDateString("vi-VN") : "N/A",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (role = "user") => (
        <Tag color={role === "admin" ? "red" : "blue"}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      render: (gender = "unknown") => (
        <Tag
          color={
            gender === "male"
              ? "green"
              : gender === "female"
              ? "pink"
              : "gray"
          }
        >
          {gender.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Categories",
      dataIndex: "categories",
      render: (categories) => (
        <div>
          {categories && categories.length > 0 ? (
            categories.map((cat, index) => (
              <Tag key={index} color="blue">
                {cat.name}
              </Tag>
            ))
          ) : (
            <span>No categories</span>
          )}
        </div>
      ),
    },
    {
      title: "",
      width: 220,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View User Insights">
            <Button 
              type="default" 
              icon={<BarChartOutlined />} 
              size="small"
              onClick={() => handleOpenInsightsModal(record._id)}
              loading={modalLoading}
            />
          </Tooltip>
          <Tooltip title="View Recommendations">
            <Button 
              type="default" 
              icon={<CheckCircleOutlined />} 
              size="small"
              onClick={() => handleOpenRecommendationsModal(record._id)}
              loading={modalLoading}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button type="primary" icon={<EditOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm title="Delete user?" okText="Yes" cancelText="No">
              <Button danger size="small" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-management-container">
      {/* HEADER */}
      <div className="admin-management-header">
        <h2>User Management</h2>

        <div className="admin-management-actions">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search users..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ width: 300 }}
          />
        </div>
      </div>

      {/* TABLE */}
      <Table
        rowKey="_id"
        loading={loading}
        columns={columns}
        dataSource={filteredUsers}
        pagination={{
          pageSize: 6,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} users`,
        }}
        className="admin-management-table"
        locale={{
          emptyText: (
            <Empty
              description={
                <span style={{ color: "#fff", opacity: 0.7 }}>
                  No User Available
                </span>
              }
            />
          ),
        }}
      />

      {/* USER INSIGHTS MODAL */}
      <Modal
        title="User Behavior Insights"
        open={insightsModalOpen}
        onCancel={() => setInsightsModalOpen(false)}
        footer={null}
        width={950}
      >
        {modalLoading ? (
          <Spin style={{ display: 'flex', justifyContent: 'center', padding: '50px' }} />
        ) : insightsData && insightsData.aiInsights ? (
          <div>
            {/* USER STATUS + ADVICE */}
            <Card style={{ marginBottom: 20, backgroundColor: '#f0f8ff', borderColor: '#1890ff' }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <div>
                    <h4>👤 User Status</h4>
                    <Tag color={insightsData.aiInsights.user_status === 'ACTIVE' ? 'green' : insightsData.aiInsights.user_status === 'POWER_USER' ? 'gold' : insightsData.aiInsights.user_status === 'DORMANT' ? 'red' : 'orange'} style={{ fontSize: 12 }}>
                      {insightsData.aiInsights.user_status}
                    </Tag>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div>
                    <h4>💡 Suggestion</h4>
                    <p style={{ margin: 0, color: '#333', fontSize: 12 }}>{insightsData.aiInsights.status_advice}</p>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* ENGAGEMENT + ADVICE */}
            <Card style={{ marginBottom: 20, backgroundColor: '#fffbe6', borderColor: '#faad14' }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Statistic
                    title="Total Engagement"
                    value={insightsData.aiInsights.total_engagement}
                    prefix={<FireOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <div>
                    <h4 style={{ margin: '0 0 8px 0' }}>📈 How to Improve</h4>
                    <p style={{ margin: 0, color: '#333', fontSize: 12 }}>{insightsData.aiInsights.engagement_advice}</p>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* BEHAVIOR + ADVICE */}
            <Card title="📊 Behavior Analysis" style={{ marginBottom: 20 }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <p style={{ marginBottom: 0 }}><strong>Summary:</strong></p>
                  <p style={{ margin: '8px 0', color: '#666', fontSize: 13 }}>{insightsData.aiInsights.behavior_summary}</p>
                </Col>
                <Col xs={24} sm={12}>
                  <p style={{ marginBottom: 0 }}><strong>📌 Advice:</strong></p>
                  <p style={{ margin: '8px 0', color: '#666', fontSize: 13 }}>{insightsData.aiInsights.behavior_advice}</p>
                </Col>
              </Row>
            </Card>

            {/* INTERESTS + ADVICE */}
            {insightsData.aiInsights.main_interests && insightsData.aiInsights.main_interests.length > 0 && (
              <Card style={{ marginBottom: 20 }}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <h4>🎯 Main Interests</h4>
                    <Space wrap>
                      {insightsData.aiInsights.main_interests.map((interest, idx) => (
                        <Tag key={idx} color="blue">{interest}</Tag>
                      ))}
                    </Space>
                  </Col>
                  <Col xs={24} sm={12}>
                    <h4 style={{ margin: '0 0 8px 0' }}>💼 Growth Strategy</h4>
                    <p style={{ margin: 0, color: '#333', fontSize: 12 }}>{insightsData.aiInsights.interests_advice}</p>
                  </Col>
                </Row>
              </Card>
            )}

            {/* ACTIVITY + ADVICE */}
            <Card style={{ marginBottom: 20, backgroundColor: '#f6f8fb', borderColor: '#1890ff' }}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                  <Statistic
                    title="Activity Level"
                    value={insightsData.aiInsights.activity_level}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <Statistic
                    title="Days Inactive"
                    value={insightsData.aiInsights.last_active_days}
                    valueStyle={{ color: insightsData.aiInsights.last_active_days > 7 ? '#ff4d4f' : '#52c41a' }}
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <div>
                    <h4 style={{ margin: '0 0 8px 0' }}>⚠️ Risk Assessment</h4>
                    <p style={{ margin: 0, color: '#333', fontSize: 12 }}>{insightsData.aiInsights.activity_timeline_advice}</p>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* KEY INSIGHTS */}
            {insightsData.aiInsights.key_insights && insightsData.aiInsights.key_insights.length > 0 && (
              <Card title="💡 Key Insights" style={{ marginBottom: 20 }}>
                <List
                  dataSource={insightsData.aiInsights.key_insights}
                  renderItem={(insight, idx) => (
                    <List.Item key={idx} style={{ paddingLeft: 0, marginBottom: 8 }}>
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

            {/* OVERALL STRATEGY */}
            {insightsData.aiInsights.overall_strategy && (
              <Alert
                message="🎯 Comprehensive Action Plan"
                description={insightsData.aiInsights.overall_strategy}
                type="success"
                showIcon
                style={{ marginBottom: 0 }}
              />
            )}
          </div>
        ) : null}
      </Modal>

      {/* RECOMMENDATIONS MODAL */}
      <Modal
        title="User Recommendations"
        open={recommendationsModalOpen}
        onCancel={() => setRecommendationsModalOpen(false)}
        footer={null}
        width={1000}
      >
        {modalLoading ? (
          <Spin style={{ display: 'flex', justifyContent: 'center', padding: '50px' }} />
        ) : recommendationsData && recommendationsData.recommendations ? (
          <div>
            {/* MAIN SUGGESTION */}
            {recommendationsData.recommendations.suggestion && (
              <Alert
                message="🎯 Overall Recommendation"
                description={recommendationsData.recommendations.suggestion}
                type="success"
                showIcon
                style={{ marginBottom: 20, fontSize: 13 }}
              />
            )}

            {/* RECOMMENDED USERS SECTION */}
            {recommendationsData.recommendations.recommended_users && recommendationsData.recommendations.recommended_users.length > 0 && (
              <Card style={{ marginBottom: 20, backgroundColor: '#f0f8ff', borderColor: '#1890ff' }}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <h4>👥 Recommended Users ({recommendationsData.recommendations.recommended_users.length})</h4>
                    <List
                      size="small"
                      dataSource={recommendationsData.recommendations.recommended_users}
                      renderItem={(user, idx) => (
                        <List.Item key={idx} style={{ paddingLeft: 0, marginBottom: 8 }}>
                          <div style={{ width: '100%' }}>
                            <Tag color="blue">{user.username || user}</Tag>
                            {user.interest && <Tag style={{ marginLeft: 8 }}>{user.interest}</Tag>}
                            {user.reason && <p style={{ margin: '6px 0 0 0', color: '#666', fontSize: 12 }}>→ {user.reason}</p>}
                          </div>
                        </List.Item>
                      )}
                    />
                  </Col>
                  <Col xs={24} sm={12}>
                    <h4 style={{ marginTop: 0 }}>💡 Users Advice</h4>
                    <p style={{ margin: 0, color: '#333', fontSize: 12, lineHeight: 1.6 }}>
                      {recommendationsData.recommendations.users_advice}
                    </p>
                  </Col>
                </Row>
              </Card>
            )}

            {/* RECOMMENDED TAGS SECTION */}
            {recommendationsData.recommendations.recommended_tags && recommendationsData.recommendations.recommended_tags.length > 0 && (
              <Card style={{ marginBottom: 20, backgroundColor: '#f9f0ff', borderColor: '#b37feb' }}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <h4>🏷️ Tags to Explore ({recommendationsData.recommendations.recommended_tags.length})</h4>
                    <Space wrap style={{ marginBottom: 16 }}>
                      {recommendationsData.recommendations.recommended_tags.map((tag, idx) => (
                        <Tag key={idx} color="purple" style={{ padding: '6px 14px', fontSize: 12 }}>
                          {tag}
                        </Tag>
                      ))}
                    </Space>
                  </Col>
                  <Col xs={24} sm={12}>
                    <h4 style={{ marginTop: 0 }}>💡 Tags Strategy</h4>
                    <p style={{ margin: 0, color: '#333', fontSize: 12, lineHeight: 1.6 }}>
                      {recommendationsData.recommendations.tags_advice}
                    </p>
                  </Col>
                </Row>
              </Card>
            )}

            {/* TRENDING TOPICS SECTION */}
            {recommendationsData.recommendations.trending_topics && recommendationsData.recommendations.trending_topics.length > 0 && (
              <Card style={{ marginBottom: 20, backgroundColor: '#fffbe6', borderColor: '#faad14' }}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <h4>📈 Trending Topics ({recommendationsData.recommendations.trending_topics.length})</h4>
                    <List
                      size="small"
                      dataSource={recommendationsData.recommendations.trending_topics}
                      renderItem={(topic, idx) => (
                        <List.Item key={idx} style={{ paddingLeft: 0 }}>
                          <Tag color="orange" style={{ fontSize: 12, padding: '6px 14px' }}>
                            {topic}
                          </Tag>
                        </List.Item>
                      )}
                    />
                  </Col>
                  <Col xs={24} sm={12}>
                    <h4 style={{ marginTop: 0 }}>💡 Trending Advice</h4>
                    <p style={{ margin: 0, color: '#333', fontSize: 12, lineHeight: 1.6 }}>
                      {recommendationsData.recommendations.topics_advice}
                    </p>
                  </Col>
                </Row>
              </Card>
            )}

            {/* ENGAGEMENT STRATEGY */}
            <Alert
              message="🎯 Next Steps"
              description="Reach out with personalized content based on these recommendations. Suggest following recommended users to build network. Feature trending topics in user feed to maintain engagement."
              type="info"
              showIcon
              style={{ marginBottom: 0 }}
            />
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default ListOfUsers;
