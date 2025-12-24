import { useState } from 'react';
import { Card, Button, Row, Col, Tag, Spin, Table, Statistic, Space, Segmented, Alert } from 'antd';
import { BarChartOutlined, ReloadOutlined, UserOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { runSegmentation, getSegmentAnalysis } from '../../utils/Api/adminApi';
import '../../styles/admin.css';

export default function UserSegmentation() {
  const [loading, setLoading] = useState(false);
  const [segmentLoading, setSegmentLoading] = useState(false);
  const [segmentation, setSegmentation] = useState(null);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [segmentDetails, setSegmentDetails] = useState(null);
  const [activeSegment, setActiveSegment] = useState('ACTIVE');

  const segments = ['ACTIVE', 'DORMANT', 'SPAM', 'QUALITY_CONTRIBUTOR', 'NEW_USER'];

  const handleRunSegmentation = async () => {
    setLoading(true);
    try {
      const res = await runSegmentation();
      setSegmentation(res.data);
      setSelectedSegment('ACTIVE');
      toast.success('User segmentation completed');
      fetchSegmentDetails('ACTIVE');
    } catch (err) {
      toast.error(err?.response?.data?.EM || err?.response?.data?.message || 'Failed to run segmentation');
    } finally {
      setLoading(false);
    }
  };

  const fetchSegmentDetails = async (segment) => {
    setSegmentLoading(true);
    try {
      const res = await getSegmentAnalysis(segment);
      setSegmentDetails(res.data);
      setActiveSegment(segment);
    } catch (err) {
      toast.error(err?.response?.data?.EM || err?.response?.data?.message || 'Failed to load segment details');
    } finally {
      setSegmentLoading(false);
    }
  };

  const getSegmentColor = (segment) => {
    const colors = {
      'ACTIVE': 'green',
      'DORMANT': 'orange',
      'SPAM': 'red',
      'QUALITY_CONTRIBUTOR': 'blue',
      'NEW_USER': 'cyan'
    };
    return colors[segment];
  };

  const columns = [
    {
      title: 'Username',
      dataIndex: ['userId', 'username'],
      key: 'username'
    },
    {
      title: 'Blogs',
      dataIndex: ['userId', 'blogCount'],
      key: 'blogs'
    },
    {
      title: 'Churn Risk',
      dataIndex: 'churnRisk',
      key: 'churnRisk',
      render: (risk) => (
        <div style={{
          padding: '4px 8px',
          backgroundColor: risk > 70 ? '#ffecec' : risk > 40 ? '#fff7e6' : '#f6ffed',
          borderRadius: 4,
          color: risk > 70 ? '#ff4d4f' : risk > 40 ? '#faad14' : '#52c41a'
        }}>
          {Math.round(risk)}%
        </div>
      )
    },
    {
      title: 'Engagement',
      dataIndex: 'engagementScore',
      key: 'engagement',
      render: (score) => (
        <div style={{
          padding: '4px 8px',
          backgroundColor: '#f6f8fb',
          borderRadius: 4,
        }}>
          {Math.round(score)}/100
        </div>
      )
    }
  ];

  return (
    <div className="admin-section">
      <h1>User Segmentation & Analytics</h1>

      <Card style={{ marginBottom: 24 }}>
        <Space>
          <Button
            type="primary"
            size="large"
            loading={loading}
            icon={<ReloadOutlined />}
            onClick={handleRunSegmentation}
          >
            Run Segmentation
          </Button>
          <span style={{ color: '#666' }}>
            {segmentation && `Last run: ${new Date(segmentation.generatedAt).toLocaleString()}`}
          </span>
        </Space>
      </Card>

      {segmentation && (
        <>
          <Row gutter={[12, 12]} style={{ marginBottom: 24 }}>
            {segments.map((segment) => (
              <Col xs={12} sm={8} md={4} key={segment}>
                <Card
                  hoverable
                  onClick={() => fetchSegmentDetails(segment)}
                  style={{
                    borderColor: activeSegment === segment ? '#1890ff' : undefined,
                    borderWidth: activeSegment === segment ? 2 : 1,
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <Tag color={getSegmentColor(segment)} style={{ marginBottom: 8 }}>
                      {segment}
                    </Tag>
                    <div style={{ fontSize: 24, fontWeight: 'bold' }}>
                      {segmentation.summary?.[segment] || 0}
                    </div>
                    <small style={{ color: '#666' }}>users</small>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {segmentDetails && (
            <Card title={`${activeSegment} Segment Analysis`}>
              <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={8}>
                  <Statistic
                    title="Total Users"
                    value={segmentDetails.totalInSegment}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <Statistic
                    title="Avg Churn Risk"
                    value={Math.round(segmentDetails.avgChurnRisk)}
                    suffix="%"
                    valueStyle={{
                      color: segmentDetails.avgChurnRisk > 50 ? '#ff4d4f' : '#52c41a'
                    }}
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <Statistic
                    title="Avg Engagement"
                    value={Math.round(segmentDetails.avgEngagement)}
                    suffix="/100"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
              </Row>

              {segmentLoading ? (
                <Spin />
              ) : (
                <Table
                  columns={columns}
                  dataSource={segmentDetails.users}
                  rowKey="_id"
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 800 }}
                />
              )}
            </Card>
          )}
        </>
      )}

      {!segmentation && !loading && (
        <Alert
          message="Click 'Run Segmentation' to analyze and categorize all users"
          type="info"
          showIcon
        />
      )}
    </div>
  );
}
