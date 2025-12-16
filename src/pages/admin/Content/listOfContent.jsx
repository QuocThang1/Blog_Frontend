import { useState, useEffect } from "react";
import { Table, Button, Space, Popconfirm, Tag, Input, Tabs, Card, Statistic, Row, Col } from "antd";
import {
    CheckOutlined,
    CloseOutlined,
    DeleteOutlined,
    SearchOutlined,
    LinkOutlined,
    FileTextOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined
} from "@ant-design/icons";
import { toast } from "react-toastify";
import {
    getAllSubmissionsApi,
    getSubmissionsByStatusApi,
    getSubmissionsStatsApi,
    approveSubmissionApi,
    rejectSubmissionApi,
    deleteSubmissionApi
} from "../../../utils/Api/blogSubmissionApi";
import "../../../styles/adminManagement.css";
import "../../../styles/contentManagement.css";

const ListOfSubmissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
    });

    useEffect(() => {
        fetchStats();
        fetchSubmissions();
    }, [activeTab]);

    const fetchStats = async () => {
        try {
            const res = await getSubmissionsStatsApi();
            if (res && res.EC === 0) {
                setStats(res.data || {});
            }
        } catch (error) {
            console.error("Fetch stats error:", error);
        }
    };

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            let res;
            if (activeTab === "all") {
                res = await getAllSubmissionsApi();
            } else {
                res = await getSubmissionsByStatusApi(activeTab);
            }

            if (res && res.EC === 0) {
                setSubmissions(res.data || []);
            } else {
                toast.error(res.EM || "Failed to fetch submissions");
            }
        } catch (error) {
            console.error("Fetch submissions error:", error);
            toast.error("Failed to fetch submissions");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (submissionId) => {
        try {
            const res = await approveSubmissionApi(submissionId);
            if (res && res.EC === 0) {
                toast.success(res.EM || "Submission approved successfully");
                fetchStats();
                fetchSubmissions();
            } else {
                toast.error(res.EM || "Failed to approve submission");
            }
        } catch (error) {
            console.error("Approve error:", error);
            toast.error(error?.response?.data?.EM || "Failed to approve submission");
        }
    };

    const handleReject = async (submissionId) => {
        try {
            const res = await rejectSubmissionApi(submissionId);
            if (res && res.EC === 0) {
                toast.success(res.EM || "Submission rejected successfully");
                fetchStats();
                fetchSubmissions();
            } else {
                toast.error(res.EM || "Failed to reject submission");
            }
        } catch (error) {
            console.error("Reject error:", error);
            toast.error(error?.response?.data?.EM || "Failed to reject submission");
        }
    };

    const handleDelete = async (submissionId) => {
        try {
            const res = await deleteSubmissionApi(submissionId);
            if (res && res.EC === 0) {
                toast.success(res.EM || "Submission deleted successfully");
                fetchStats();
                fetchSubmissions();
            } else {
                toast.error(res.EM || "Failed to delete submission");
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error(error?.response?.data?.EM || "Failed to delete submission");
        }
    };

    const getStatusTag = (status) => {
        const statusConfig = {
            pending: { color: "gold", text: "Pending", icon: <ClockCircleOutlined /> },
            approved: { color: "success", text: "Approved", icon: <CheckCircleOutlined /> },
            rejected: { color: "error", text: "Rejected", icon: <CloseCircleOutlined /> }
        };
        const config = statusConfig[status];
        return <Tag color={config.color} icon={config.icon}>{config.text}</Tag>;
    };

    const filteredSubmissions = submissions.filter(
        (submission) =>
            submission.author?.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
            submission.author?.email?.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: "No",
            key: "index",
            width: 60,
            align: "center",
            render: (text, record, index) => index + 1,
        },
        {
            title: "Author",
            dataIndex: ["author", "fullName"],
            key: "author",
            width: 150,
            render: (text, record) => (
                <div>
                    <div style={{ color: "#fff", fontWeight: 500 }}>{text}</div>
                    <div style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "12px" }}>
                        {record.author?.email}
                    </div>
                </div>
            ),
        },
        {
            title: "Link",
            dataIndex: "link",
            key: "link",
            width: 300,
            render: (link) => (
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#64b5f6", display: "flex", alignItems: "center", gap: "6px" }}
                >
                    <LinkOutlined /> View Document
                </a>
            ),
        },
        {
            title: "Submitted Date",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 140,
            align: "center",
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            render: (date) => (
                <div style={{ color: "rgba(255, 255, 255, 0.85)" }}>
                    {new Date(date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                    })}
                </div>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 120,
            align: "center",
            filters: [
                { text: "Pending", value: "pending" },
                { text: "Approved", value: "approved" },
                { text: "Rejected", value: "rejected" },
            ],
            onFilter: (value, record) => record.status === value,
            render: (status) => getStatusTag(status),
        },
        {
            title: "",
            key: "actions",
            width: 200,
            align: "center",
            fixed: "right",
            render: (text, record) => (
                <Space size="small">
                    {record.status === "pending" && (
                        <>
                            <Popconfirm
                                title="Approve this submission?"
                                description="The author will receive an approval email."
                                onConfirm={() => handleApprove(record._id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    type="primary"
                                    icon={<CheckOutlined />}
                                    size="small"
                                    style={{ background: "#52c41a", borderColor: "#52c41a" }}
                                >
                                    Approve
                                </Button>
                            </Popconfirm>
                            <Popconfirm
                                title="Reject this submission?"
                                description="The author will receive a rejection email."
                                onConfirm={() => handleReject(record._id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    danger
                                    icon={<CloseOutlined />}
                                    size="small"
                                >
                                    Reject
                                </Button>
                            </Popconfirm>
                        </>
                    )}
                    <Popconfirm
                        title="Delete this submission?"
                        description="This action cannot be undone."
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const tabItems = [
        {
            key: "all",
            label: `All (${stats.total || 0})`,
            icon: <FileTextOutlined />
        },
        {
            key: "pending",
            label: `Pending (${stats.pending || 0})`,
            icon: <ClockCircleOutlined />
        },
        {
            key: "approved",
            label: `Approved (${stats.approved || 0})`,
            icon: <CheckCircleOutlined />
        },
        {
            key: "rejected",
            label: `Rejected (${stats.rejected || 0})`,
            icon: <CloseCircleOutlined />
        },
    ];

    return (
        <div className="admin-management-container">
            {/* Header */}
            <div className="admin-management-header">
                <h2>Blog Submissions Management</h2>
                <div className="admin-management-actions">
                    <Input
                        placeholder="Search by author, email..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 300 }}
                        allowClear
                    />
                </div>
            </div>

            {/* Statistics */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} md={6}>
                    <Card className="stat-card">
                        <Statistic
                            title={<span style={{ color: "rgba(255, 255, 255, 0.7)" }}>Total Submissions</span>}
                            value={stats.total || 0}
                            valueStyle={{ color: "#64b5f6" }}
                            prefix={<FileTextOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="stat-card">
                        <Statistic
                            title={<span style={{ color: "rgba(255, 255, 255, 0.7)" }}>Pending Review</span>}
                            value={stats.pending || 0}
                            valueStyle={{ color: "#faad14" }}
                            prefix={<ClockCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="stat-card">
                        <Statistic
                            title={<span style={{ color: "rgba(255, 255, 255, 0.7)" }}>Approved</span>}
                            value={stats.approved || 0}
                            valueStyle={{ color: "#52c41a" }}
                            prefix={<CheckCircleOutlined />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="stat-card">
                        <Statistic
                            title={<span style={{ color: "rgba(255, 255, 255, 0.7)" }}>Rejected</span>}
                            value={stats.rejected || 0}
                            valueStyle={{ color: "#ff4d4f" }}
                            prefix={<CloseCircleOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Tabs & Table */}
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={tabItems}
                className="admin-tabs"
            />

            <Table
                columns={columns}
                dataSource={filteredSubmissions}
                loading={loading}
                rowKey="_id"
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} submissions`,
                    style: { color: "#ffffff" },
                }}
                scroll={{ x: 1200 }}
                className="admin-management-table"
            />
        </div>
    );
};

export default ListOfSubmissions;