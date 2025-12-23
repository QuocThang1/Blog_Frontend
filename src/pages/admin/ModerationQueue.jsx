import { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Space, Modal, Input, Spin, Pagination, Badge } from 'antd';
import { CheckOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { getModerationQueue, reviewModeration } from '../../utils/Api/adminApi';
import '../../styles/admin.css';

export default function ModerationQueue() {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchQueue();
  }, [pagination.page]);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await getModerationQueue('pending', pagination.limit, pagination.page);
      setRecords(res.data.records);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error('Failed to load moderation queue');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (record) => {
    setSelectedRecord(record);
    setReviewNotes('');
    setIsModalVisible(true);
  };

  const submitReview = async (action) => {
    if (!selectedRecord) return;

    try {
      await reviewModeration(selectedRecord._id, action, reviewNotes);
      toast.success(`Content ${action} successfully`);
      setIsModalVisible(false);
      fetchQueue();
    } catch (err) {
      toast.error('Failed to update moderation');
    }
  };

  const columns = [
    {
      title: 'Type',
      dataIndex: 'contentType',
      key: 'contentType',
      render: (type) => <Tag color={type === 'blog' ? 'blue' : 'orange'}>{type.toUpperCase()}</Tag>
    },
    {
      title: 'Author',
      dataIndex: ['authorId', 'username'],
      key: 'author',
    },
    {
      title: 'Inappropriate',
      dataIndex: ['scores', 'inappropriate'],
      key: 'inappropriate',
      render: (score) => (
        <Badge
          count={score}
          style={{
            backgroundColor: score > 70 ? '#ff4d4f' : score > 40 ? '#faad14' : '#52c41a'
          }}
        />
      )
    },
    {
      title: 'Spam',
      dataIndex: ['scores', 'spam'],
      key: 'spam',
      render: (score) => (
        <Badge
          count={score}
          style={{
            backgroundColor: score > 70 ? '#ff4d4f' : score > 40 ? '#faad14' : '#52c41a'
          }}
        />
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleReview(record)}
          >
            Review
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div className="admin-section">
      <h1>Content Moderation Queue</h1>

      {loading ? (
        <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }} />
      ) : (
        <>
          <Card>
            <Table
              columns={columns}
              dataSource={records}
              rowKey="_id"
              pagination={false}
              loading={loading}
            />
            <Pagination
              current={pagination.page}
              pageSize={pagination.limit}
              total={pagination.total}
              onChange={(page) => setPagination({ ...pagination, page })}
              style={{ marginTop: 16, textAlign: 'right' }}
            />
          </Card>

          <Modal
            title="Review Moderation"
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={[
              <Button key="dismiss" onClick={() => submitReview('dismiss')}>
                Dismiss
              </Button>,
              <Button key="approve" type="primary" onClick={() => submitReview('approve')} icon={<CheckOutlined />}>
                Approve
              </Button>,
              <Button key="remove" danger onClick={() => submitReview('remove')} icon={<DeleteOutlined />}>
                Remove
              </Button>
            ]}
          >
            {selectedRecord && (
              <div>
                <h3>Moderation Details</h3>
                <p><strong>Type:</strong> {selectedRecord.contentType}</p>
                <p><strong>Author:</strong> {selectedRecord.authorId?.username}</p>
                <p><strong>Recommended Action:</strong> <Tag color="blue">{selectedRecord.recommendedAction}</Tag></p>
                <p><strong>Reason:</strong> {selectedRecord.reason}</p>
                <div style={{ marginTop: 16 }}>
                  <strong>Flags:</strong>
                  <div>
                    {selectedRecord.flags?.map((flag, idx) => (
                      <Tag key={idx} color="red">{flag}</Tag>
                    ))}
                  </div>
                </div>
                <Input.TextArea
                  placeholder="Add review notes..."
                  rows={4}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  style={{ marginTop: 16 }}
                />
              </div>
            )}
          </Modal>
        </>
      )}
    </div>
  );
}
