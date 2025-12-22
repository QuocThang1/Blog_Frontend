import { useState, useEffect, useContext } from "react";
import { Card, Input, Button, Form, Alert, Table, Tag, Space } from "antd";
import {
    SendOutlined,
    LinkOutlined,
    InfoCircleOutlined
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { AuthContext } from "../context/auth.context";
import { createSubmissionApi, getMySubmissionsApi } from "../utils/Api/blogSubmissionApi";
import "../styles/shareBlog.css";

const ShareBlog = () => {
    const { auth } = useContext(AuthContext);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [submissions, setSubmissions] = useState([]);
    const [loadingSubmissions, setLoadingSubmissions] = useState(true);

    useEffect(() => {
        if (auth.isAuthenticated) {
            fetchMySubmissions();
        }
    }, [auth.isAuthenticated]);

    const fetchMySubmissions = async () => {
        setLoadingSubmissions(true);
        try {
            const res = await getMySubmissionsApi();
            if (res && res.EC === 0) {
                setSubmissions(res.data || []);
            }
        } catch (error) {
            console.error("Fetch submissions error:", error);
        } finally {
            setLoadingSubmissions(false);
        }
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const res = await createSubmissionApi(values.link);
            if (res && res.EC === 0) {
                toast.success(res.EM || "Submission sent successfully!");
                form.resetFields();
                await fetchMySubmissions();
            } else {
                toast.error(res.EM || "Failed to submit");
            }
        } catch (error) {
            console.error("Submit error:", error);
            toast.error(error?.response?.data?.EM || "Failed to submit");
        } finally {
            setLoading(false);
        }
    };

    const getStatusTag = (status) => {
        const statusConfig = {
            pending: { color: "gold", text: "Pending" },
            approved: { color: "success", text: "Approved" },
            rejected: { color: "error", text: "Rejected" }
        };
        const config = statusConfig[status];
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    const columns = [
        {
            title: "Submitted Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
            }),
            width: 150
        },
        {
            title: "Link",
            dataIndex: "link",
            key: "link",
            render: (link) => (
                <a href={link} target="_blank" rel="noopener noreferrer" className="submission-link">
                    <LinkOutlined /> View Document
                </a>
            )
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => getStatusTag(status),
            width: 120
        }
    ];

    if (!auth.isAuthenticated) {
        return (
            <div className="share-blog-page">
                <div className="share-blog-container">
                    <Card className="auth-required-card">
                        <InfoCircleOutlined className="info-icon" />
                        <h2>Login Required</h2>
                        <p>Please login to submit your blog posts and get rewards.</p>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="share-blog-page">
            <div className="share-blog-container">
                {/* Page Header */}
                <div className="page-header">
                    <h1>Submit Your Blog</h1>
                    <p>Share your creative work and get rewarded for quality content</p>
                </div>

                {/* Hero Image */}
                <div className="hero-image-wrapper">
                    <img
                        src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=400&fit=crop"
                        alt="Blog Writing"
                        className="hero-image"
                    />
                </div>

                {/* Info Alert */}
                <Alert
                    message="How It Works"
                    description={
                        <div className="info-content">
                            <p><strong>1.</strong> Upload your blog to Google Drive and get a shareable link</p>
                            <p><strong>2.</strong> Submit the link below for review</p>
                            <p><strong>3.</strong> Wait for admin approval (usually within 48 hours)</p>
                            <p><strong>4.</strong> Approved submissions will receive rewards</p>
                        </div>
                    }
                    type="info"
                    showIcon
                    className="info-alert"
                />

                {/* Submission Form */}
                <Card className="submission-card" title="Submit New Blog">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            label="Google Drive Link"
                            name="link"
                            rules={[
                                { required: true, message: "Please enter Google Drive link" },
                                {
                                    pattern: /^https:\/\/drive\.google\.com\//,
                                    message: "Must be a valid Google Drive link"
                                }
                            ]}
                        >
                            <Input
                                prefix={<LinkOutlined />}
                                placeholder="https://drive.google.com/..."
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<SendOutlined />}
                                loading={loading}
                                size="large"
                            >
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>

                {/* Submissions History */}
                <Card
                    className="submissions-card"
                    title={
                        <Space>
                            <span>My Submissions</span>
                            <Tag color="blue">{submissions.length}</Tag>
                        </Space>
                    }
                >
                    <Table
                        columns={columns}
                        dataSource={submissions}
                        loading={loadingSubmissions}
                        rowKey="_id"
                        pagination={{
                            pageSize: 10,
                            showTotal: (total) => `Total ${total} submissions`
                        }}
                        locale={{
                            emptyText: "No submissions yet"
                        }}
                    />
                </Card>
            </div>
        </div>
    );
};

export default ShareBlog;