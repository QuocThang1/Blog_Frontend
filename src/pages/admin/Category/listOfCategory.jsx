import { useState, useEffect } from "react";
import { Table, Button, Space, Popconfirm, Tag, Input, Empty } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { getAllCategoriesApi, deleteCategoryApi } from "../../../utils/Api/categoryApi";
import CategoryModal from "./categoryModal";
import "../../../styles/category.css";

const ListOfCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await getAllCategoriesApi();
            if (res && res.EC === 0) {
                setCategories(res.data || []);
            } else {
                toast.error(res.EM || "Failed to fetch categories");
            }
        } catch (error) {
            console.error("Fetch categories error:", error);
            toast.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingCategory(record);
        setIsModalOpen(true);
    };

    const handleDelete = async (categoryId) => {
        try {
            const res = await deleteCategoryApi(categoryId);
            if (res && res.EC === 0) {
                toast.success(res.EM || "Category deleted successfully");
                fetchCategories();
            } else {
                toast.error(res.EM || "Failed to delete category");
            }
        } catch (error) {
            console.error("Delete category error:", error);
            toast.error(error?.response?.data?.EM || "Failed to delete category");
        }
    };

    const handleModalSuccess = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        fetchCategories();
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    const filteredCategories = categories.filter(
        (category) =>
            category.name?.toLowerCase().includes(searchText.toLowerCase()) ||
            category.description?.toLowerCase().includes(searchText.toLowerCase())
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
            width: 140,
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (text) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: 300,
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
                        title="Delete Category"
                        description="Are you sure to delete this category?"
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
        <div className="category-container">
            <div className="category-header">
                <h2>Category Management</h2>
                <div className="category-actions">
                    <Input
                        placeholder="Search categories..."
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
                        Create Category
                    </Button>
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={filteredCategories}
                loading={loading}
                rowKey="_id"
                pagination={{
                    pageSize: 6,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} categories`,
                    style: { color: "#ffffff" }
                }}
                className="category-table"
                locale={{
                    emptyText: (
                        <Empty
                            description={
                                <span style={{ color: "black" }}>
                                    No Category Available
                                </span>
                            }
                        />
                    ),
                }}
            />

            <CategoryModal
                open={isModalOpen}
                category={editingCategory}
                onSuccess={handleModalSuccess}
                onCancel={handleModalCancel}
            />
        </div>
    );
};

export default ListOfCategory;