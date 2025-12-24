import { useState } from 'react';
import { Card, Button, Row, Col, Tag, Spin, Statistic, Space, Radio, Alert, List, Divider } from 'antd';
import { FileTextOutlined, ReloadOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { generateReport } from '../../utils/Api/adminApi';
import '../../styles/admin.css';

export default function AdminReports() {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('daily');
  const [report, setReport] = useState(null);

  // Helper function to render items (handle both string and object)
  const renderItem = (item) => {
    if (typeof item === 'string') return item;
    if (typeof item === 'object' && item !== null) {
      // If it's an object, combine all values
      return Object.values(item).filter(v => v).join(' - ');
    }
    return String(item);
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const res = await generateReport(reportType);
      setReport(res.data);
      toast.success('Report generated');
    } catch (err) {
      toast.error(err?.response?.data?.EM || err?.response?.data?.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-section">
      <h1>Platform Health Report</h1>

      <Card style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div>
            <strong>Period:</strong>
            <Radio.Group value={reportType} onChange={(e) => setReportType(e.target.value)} style={{ marginLeft: 16 }}>
              <Radio value="daily">Daily</Radio>
              <Radio value="weekly">Weekly</Radio>
              <Radio value="monthly">Monthly</Radio>
            </Radio.Group>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<ReloadOutlined />}
            onClick={handleGenerateReport}
            loading={loading}
          >
            Generate Report
          </Button>
        </Space>
      </Card>

      {loading && <Spin size="large" style={{ display: 'flex', justifyContent: 'center' }} />}

      {report && report.report && (
        <div>
          {/* OVERALL SUMMARY */}
          {report.report.summary && (
            <Card style={{ marginBottom: 24, backgroundColor: '#f0f8ff' }}>
              <h3>📊 Summary</h3>
              <p style={{ fontSize: 16, lineHeight: 1.8, marginBottom: 0 }}>{report.report.summary}</p>
            </Card>
          )}

          {/* HEALTH + ADVICE */}
          <Card
            title="💊 Overall Platform Health"
            style={{ marginBottom: 24, backgroundColor: '#f0f8ff', borderColor: '#1890ff' }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Statistic
                  title="Overall Health"
                  value={report.report.overall_health || 'Good'}
                  valueStyle={{
                    color: report.report.overall_health === 'HEALTHY' ? '#52c41a' :
                           report.report.overall_health === 'AT_RISK' ? '#faad14' : '#ff4d4f'
                  }}
                />
              </Col>
              <Col xs={24} sm={12}>
                <div style={{ padding: 12, backgroundColor: '#e6f7ff', borderRadius: 4 }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#1890ff' }}>🔍 Assessment</h4>
                  <p style={{ margin: 0, color: '#333', fontSize: 12 }}>
                    {report.report.health_advice || 'Monitor key metrics and implement recommended actions. Regular reviews ensure platform stability.'}
                  </p>
                </div>
              </Col>
            </Row>
          </Card>

          {/* STRATEGIC RECOMMENDATION */}
          {report.report.strategic_recommendation && (
            <Alert
              message="🚀 Strategic Recommendation"
              description={report.report.strategic_recommendation}
              type="success"
              showIcon
              style={{ marginBottom: 24 }}
            />
          )}

          {/* HIGHLIGHTS + ADVICE */}
          {report.report.highlights && report.report.highlights.length > 0 && (
            <Card
              title={<span><CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />✅ Highlights</span>}
              style={{ marginBottom: 24, borderColor: '#52c41a' }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <List
                    dataSource={report.report.highlights}
                    renderItem={(item, idx) => (
                      <List.Item key={`${JSON.stringify(item).slice(0,30)}-${idx}`} style={{ paddingLeft: 0 }}>
                        <div style={{
                          padding: 12,
                          backgroundColor: '#f6ffed',
                          borderLeft: '4px solid #52c41a',
                          borderRadius: 4,
                          width: '100%'
                        }}>
                          {renderItem(item)}
                        </div>
                      </List.Item>
                    )}
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <div style={{ padding: 12, backgroundColor: '#f6ffed', borderRadius: 4 }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#52c41a' }}>💡 Strategy</h4>
                    <p style={{ margin: 0, color: '#333', fontSize: 12 }}>
                      {report.report.highlights_advice || 'Maintain momentum on these positive outcomes. Continue successful strategies and share wins with stakeholders.'}
                    </p>
                  </div>
                </Col>
              </Row>
            </Card>
          )}

          {/* ISSUES + ADVICE */}
          {report.report.issues && report.report.issues.length > 0 && (
            <Card
              title={<span><ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />⚠️ Issues to Address</span>}
              style={{ marginBottom: 24, borderColor: '#ff4d4f' }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <List
                    dataSource={report.report.issues}
                    renderItem={(item, idx) => (
                      <List.Item key={`${JSON.stringify(item).slice(0,30)}-${idx}`} style={{ paddingLeft: 0 }}>
                        <div style={{
                          padding: 12,
                          backgroundColor: '#fff1f0',
                          borderLeft: '4px solid #ff4d4f',
                          borderRadius: 4,
                          width: '100%'
                        }}>
                          {renderItem(item)}
                        </div>
                      </List.Item>
                    )}
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <div style={{ padding: 12, backgroundColor: '#fff1f0', borderRadius: 4 }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#ff4d4f' }}>⚡ Analysis</h4>
                    <p style={{ margin: 0, color: '#333', fontSize: 12 }}>
                      {report.report.issues_advice || 'Investigate root causes and prioritize based on impact. Develop mitigation plans for critical issues.'}
                    </p>
                  </div>
                </Col>
              </Row>
            </Card>
          )}

          {/* ACTIONS + ADVICE */}
          {report.report.actions && report.report.actions.length > 0 && (
            <Card
              title="🎯 Recommended Actions"
              style={{ marginBottom: 24, borderColor: '#faad14' }}
            >
              <List
                dataSource={report.report.actions}
                renderItem={(item, idx) => (
                  <List.Item key={`${JSON.stringify(item).slice(0,30)}-${idx}`} style={{ paddingLeft: 0, marginBottom: 12 }}>
                    <div style={{
                      padding: 12,
                      backgroundColor: '#fffbe6',
                      borderLeft: '4px solid #faad14',
                      borderRadius: 4,
                      width: '100%'
                    }}>
                      <strong>Action {idx + 1}:</strong> {renderItem(item)}
                    </div>
                  </List.Item>
                )}
              />
              {report.report.actions_advice && (
                <div style={{ marginTop: 16, padding: 12, backgroundColor: '#f0f8ff', borderRadius: 4 }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#1890ff' }}>📋 Execution Plan</h4>
                  <p style={{ margin: 0, color: '#333', fontSize: 12 }}>
                    {report.report.actions_advice}
                  </p>
                </div>
              )}
            </Card>
          )}

          {/* Platform Stats if available */}
          {report.stats && (
            <Card title="📈 Platform Statistics" style={{ marginBottom: 24 }}>
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={8}>
                  <Statistic
                    title="Total Blogs"
                    value={report.stats?.totalBlogs || 0}
                  />
                </Col>
                <Col xs={12} sm={8}>
                  <Statistic
                    title="Total Comments"
                    value={report.stats?.totalComments || 0}
                  />
                </Col>
                <Col xs={12} sm={8}>
                  <Statistic
                    title="Total Likes"
                    value={report.stats?.totalLikes || 0}
                  />
                </Col>
              </Row>
            </Card>
          )}
        </div>
      )}

      {!report && !loading && (
        <Alert
          message="Generate a platform health report to monitor overall performance, user engagement, and identify issues"
          type="info"
          showIcon
        />
      )}
    </div>
  );
}
