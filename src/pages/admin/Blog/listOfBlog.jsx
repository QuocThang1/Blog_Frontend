import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Space, Popconfirm, Tag, Input, Image, Empty } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, EyeOutlined, HeartOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { getAllBlogsApi, deleteBlogApi } from "../../../utils/Api/blogApi";
import BlogModal from "./blogModal";
import "../../../styles/adminManagement.css";

const ListOfBlog = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const res = await getAllBlogsApi();
            console.log("Fetch blogs response:", res);
            if (res && res.EC === 0) {
                setBlogs(res.data || []);
            } else {
                toast.error(res.message || "Failed to fetch blogs");
            }
        } catch (error) {
            console.error("Fetch blogs error:", error);
            toast.error("Failed to fetch blogs");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingBlog(null);
        setIsModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingBlog(record);
        setIsModalOpen(true);
    };

    const handleDelete = async (blogId) => {
        try {
            const res = await deleteBlogApi(blogId);
            if (res && res.EC === 0) {
                toast.success(res.EM || "Blog deleted successfully");
                fetchBlogs();
            } else {
                toast.error(res.message || "Failed to delete blog");
            }
        } catch (error) {
            console.error("Delete blog error:", error);
            toast.error(error.message || "Failed to delete blog");
        }
    };

    const handleModalSuccess = () => {
        setIsModalOpen(false);
        setEditingBlog(null);
        fetchBlogs();
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
        setEditingBlog(null);
    };

    const filteredBlogs = blogs.filter(
        (blog) =>
            blog.title?.toLowerCase().includes(searchText.toLowerCase()) ||
            blog.description?.toLowerCase().includes(searchText.toLowerCase()) ||
            blog.author?.fullName?.toLowerCase().includes(searchText.toLowerCase())
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
            title: "Image",
            dataIndex: "image",
            key: "image",
            width: 100,
            align: "center",
            render: (image) => (
                image ? (
                    <Image
                        src={image}
                        alt="blog"
                        width={60}
                        height={60}
                        style={{ objectFit: "cover", borderRadius: "8px" }}
                        preview={{
                            mask: <EyeOutlined />,
                        }}
                    />
                ) : (
                    <div style={{
                        width: 60,
                        height: 60,
                        background: "rgba(100, 181, 246, 0.2)",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "rgba(255, 255, 255, 0.5)"
                    }}>
                        No Image
                    </div>
                )
            ),
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            width: 200,
            sorter: (a, b) => a.title.localeCompare(b.title),
            render: (text) => <span style={{ fontWeight: 600, color: "#64b5f6" }}>{text}</span>,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: 250,
            render: (text) => (
                <div style={{
                    whiteSpace: "normal",
                    wordWrap: "break-word",
                    lineHeight: "1.5"
                }}>
                    {text}
                </div>
            ),
        },
        {
            title: "Category",
            dataIndex: ["category", "name"],
            key: "category",
            width: 130,
            render: (text) => <Tag color="green">{text || "N/A"}</Tag>,
        },
        {
            title: "Tags",
            dataIndex: "tags",
            key: "tags",
            width: 200,
            render: (tags) => (
                <Space size={[0, 4]} wrap>
                    {tags && tags.length > 0 ? (
                        tags.map((tag) => (
                            <Tag key={tag._id} color={tag.color} style={{ margin: '2px' }}>
                                {tag.name}
                            </Tag>
                        ))
                    ) : (
                        <span style={{ color: 'rgba(255, 255, 255, 0.5)', fontStyle: 'italic' }}>
                            No tags
                        </span>
                    )}
                </Space>
            ),
        },
        {
            title: "Author",
            dataIndex: ["author", "fullName"],
            key: "author",
            width: 120,
            render: (text) => <span>{text || "Unknown"}</span>,
        },
        {
            title: "Stats",
            key: "stats",
            width: 100,
            align: "center",
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <span>
                        <EyeOutlined style={{ marginRight: 5, color: "#64b5f6" }} />
                        {record.views || 0}
                    </span>
                    <span>
                        <HeartOutlined style={{ marginRight: 5, color: "#ff6b6b" }} />
                        {record.likesCount || 0}
                    </span>
                </Space>
            ),
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 120,
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            render: (date) => new Date(date).toLocaleDateString("vi-VN"),
        },
        {
            title: "",
            key: "actions",
            width: 150,
            align: "center",
            fixed: "right",
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
                        title="Delete Blog"
                        description="Are you sure to delete this blog?"
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
                <h2>Blog Management</h2>
                <div className="admin-management-actions">
                    <Input
                        placeholder="Search blogs..."
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
                        Create Blog
                    </Button>
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={filteredBlogs}
                loading={loading}
                rowKey="_id"
                pagination={{
                    pageSize: 6,
                    showSizeChanger: true,
                    style: { color: "white" },
                    showTotal: (total) => `Total ${total} blogs`,
                }}
                scroll={{ x: 1600 }}
                className="admin-management-table"
                locale={{
                    emptyText: (
                        <Empty
                            description={
                                <span style={{ color: "black" }}>
                                    No Blog Available
                                </span>
                            }
                        />
                    ),
                }}
                onRow={(record) => ({
                    onClick: (e) => {
                        if (
                            e.target.closest('.ant-btn') ||
                            e.target.closest('.ant-popover') ||
                            e.target.closest('.ant-image')
                        ) {
                            return;
                        }
                        navigate(`/profile/blogs/${record._id}`);
                    },
                    style: { cursor: 'pointer' }
                })}
            />

            <BlogModal
                open={isModalOpen}
                blog={editingBlog}
                onSuccess={handleModalSuccess}
                onCancel={handleModalCancel}
            />
        </div>
    );
};

export default ListOfBlog;