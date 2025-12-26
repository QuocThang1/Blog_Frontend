import { useState, useEffect } from "react";
import { Table, Button, Space, Popconfirm, Tag, Input, Empty } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { getAllTagsApi, deleteTagApi } from "../../../utils/Api/tagApi";
import TagModal from "./tagModal";
import "../../../styles/adminManagement.css";

const ListOfTag = () => {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTag, setEditingTag] = useState(null);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        setLoading(true);
        try {
            const res = await getAllTagsApi();
            if (res && res.EC === 0) {
                setTags(res.data || []);
            } else {
                toast.error(res.message || "Failed to fetch tags");
            }
        } catch (error) {
            console.error("Fetch tags error:", error);
            toast.error("Failed to fetch tags");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingTag(null);
        setIsModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingTag(record);
        setIsModalOpen(true);
    };

    const handleDelete = async (tagId) => {
        try {
            const res = await deleteTagApi(tagId);
            if (res && res.EC === 0) {
                toast.success(res.EM || "Tag deleted successfully");
                fetchTags();
            } else {
                toast.error(res.message || "Failed to delete tag");
            }
        } catch (error) {
            console.error("Delete tag error:", error);
            toast.error(error.message || "Failed to delete tag");
        }
    };

    const handleModalSuccess = () => {
        setIsModalOpen(false);
        setEditingTag(null);
        fetchTags();
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
        setEditingTag(null);
    };

    const filteredTags = tags.filter(
        (tag) =>
            tag.name?.toLowerCase().includes(searchText.toLowerCase()) ||
            tag.description?.toLowerCase().includes(searchText.toLowerCase())
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
            title: "Name",
            dataIndex: "name",
            key: "name",
            width: 180,
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (text, record) => (
                <Tag color={record.color} style={{ fontSize: '14px', padding: '4px 12px' }}>
                    {text}
                </Tag>
            ),
        },
        {
            title: "Slug",
            dataIndex: "slug",
            key: "slug",
            width: 180,
            render: (text) => (
                <span style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontFamily: 'monospace',
                    fontSize: '13px'
                }}>
                    {text}
                </span>
            ),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: 280,
            render: (text) => (
                <div style={{
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    lineHeight: "1.5",
                    color: 'rgba(255, 255, 255, 0.8)'
                }}>
                    {text || <span style={{ fontStyle: 'italic', opacity: 0.5 }}>No description</span>}
                </div>
            ),
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 130,
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            render: (date) => new Date(date).toLocaleDateString("vi-VN"),
        },
        {
            title: "",
            key: "actions",
            width: 150,
            align: "center",
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEdit(record)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete Tag"
                        description="Are you sure to delete this tag?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />} size="small">
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="admin-management-container">
            <div className="admin-management-header">
                <h2>Tag Management</h2>
                <div className="admin-management-actions">
                    <Input
                        placeholder="Search tags..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 300 }}
                        allowClear
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreate}
                        size="large"
                    >
                        Create Tag
                    </Button>
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={filteredTags}
                loading={loading}
                rowKey="_id"
                pagination={{
                    pageSize: 6,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} tags`,
                    style: { color: "#ffffff" }
                }}
                className="admin-management-table"
                locale={{
                    emptyText: (
                        <Empty
                            description={
                                <span style={{ color: "black" }}>
                                    No Tag Available
                                </span>
                            }
                        />
                    ),
                }}
            />

            <TagModal
                open={isModalOpen}
                tag={editingTag}
                onSuccess={handleModalSuccess}
                onCancel={handleModalCancel}
            />
        </div>
    );
};

export default ListOfTag;