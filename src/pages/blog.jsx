import { useState, useEffect } from "react";
import { Input, Select, Row, Col, Card, Avatar, Tag, Empty, Pagination, Space } from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getAllBlogsApi } from "../utils/Api/blogApi";
import { getAllCategoriesApi } from "../utils/Api/categoryApi";
import { getAllTagsApi } from "../utils/Api/tagApi";
import { toast } from "react-toastify";
import "../styles/blog.css";

const { Search } = Input;

const Blog = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedTags, setSelectedTags] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);

    useEffect(() => {
        fetchBlogs();
        fetchCategories();
        fetchTags();
    }, []);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const res = await getAllBlogsApi();
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

    const fetchCategories = async () => {
        try {
            const res = await getAllCategoriesApi();
            if (res && res.EC === 0) {
                setCategories(res.data || []);
            } else {
                toast.error(res.message || "Failed to fetch categories");
            }
        } catch (error) {
            console.error("Fetch categories error:", error);
            toast.error("Failed to fetch categories");
        }
    };

    const fetchTags = async () => {
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
        }
    };

    const filteredBlogs = blogs.filter((blog) => {
        const matchSearch = blog.title?.toLowerCase().includes(searchText.toLowerCase());
        const matchCategory = selectedCategory === "all" || blog.category?._id === selectedCategory;

        // Filter by tags - blog must have at least one of the selected tags
        const matchTags = selectedTags.length === 0 ||
            selectedTags.some(selectedTagId =>
                blog.tags?.some(blogTag => blogTag._id === selectedTagId)
            );

        return matchSearch && matchCategory && matchTags;
    });

    const paginatedBlogs = filteredBlogs.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handlePageChange = (page, size) => {
        setCurrentPage(page);
        setPageSize(size);
    };

    return (
        <div className="blog-page">
            <div className="blog-header">
                <h1 className="blog-title">BLOGS</h1>

                <div className="blog-filters">
                    <Search
                        placeholder="Search by title..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                            setCurrentPage(1);
                        }}
                        allowClear
                        className="blog-search"
                    />

                    <Select
                        value={selectedCategory}
                        onChange={(value) => {
                            setSelectedCategory(value);
                            setCurrentPage(1);
                        }}
                        className="blog-category-select"
                        placeholder="All Categories"
                    >
                        <Select.Option value="all">All Categories</Select.Option>
                        {categories.map((cat) => (
                            <Select.Option key={cat._id} value={cat._id}>
                                {cat.name}
                            </Select.Option>
                        ))}
                    </Select>

                    <Select
                        mode="multiple"
                        value={selectedTags}
                        onChange={(value) => {
                            setSelectedTags(value);
                            setCurrentPage(1);
                        }}
                        className="blog-tag-select"
                        placeholder="Filter by tags"
                        allowClear
                        maxTagCount="responsive"
                        tagRender={(props) => {
                            const { label, value, closable, onClose } = props;
                            const tag = tags.find(t => t._id === value);
                            return (
                                <span
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        backgroundColor: tag?.color || '#3b82f6',
                                        color: '#fff',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        margin: '2px',
                                        fontSize: '12px'
                                    }}
                                >
                                    {label}
                                    {closable && (
                                        <span
                                            onClick={onClose}
                                            style={{
                                                marginLeft: '6px',
                                                cursor: 'pointer',
                                                fontSize: '14px'
                                            }}
                                        >
                                            ×
                                        </span>
                                    )}
                                </span>
                            );
                        }}
                    >
                        {tags.map((tag) => (
                            <Select.Option key={tag._id} value={tag._id}>
                                {tag.name}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
            </div>

            {loading ? (
                <div className="blog-loading">Loading...</div>
            ) : filteredBlogs.length === 0 ? (
                <Empty description="No Blog Available" />
            ) : (
                <>
                    <Row gutter={[24, 24]} className="blog-list">
                        {paginatedBlogs.map((blog) => (
                            <Col xs={24} sm={12} lg={6} key={blog._id}>
                                <Card
                                    hoverable
                                    className="blog-card"
                                    cover={
                                        <div className="blog-card-image">
                                            <img alt={blog.title} src={blog.image} />
                                        </div>
                                    }
                                    onClick={() => navigate(`/blog/${blog._id}`)}
                                >
                                    <div className="blog-card-content">
                                        <h3 className="blog-card-title">{blog.title}</h3>

                                        <div className="blog-card-meta">
                                            <Avatar size="small" icon={<UserOutlined />} />
                                            <span className="blog-card-author">
                                                {blog.author?.fullName || blog.author?.username || "Unknown"}
                                            </span>
                                        </div>

                                        <div className="blog-card-date">
                                            {new Date(blog.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}
                                        </div>

                                        <div className="blog-card-footer">
                                            {blog.category && (
                                                <Tag className="blog-card-category">
                                                    {blog.category.name}
                                                </Tag>
                                            )}

                                            {blog.tags && blog.tags.length > 0 && (
                                                <Space size={[0, 4]} wrap className="blog-card-tags">
                                                    {blog.tags.slice(0, 3).map((tag) => (
                                                        <Tag
                                                            key={tag._id}
                                                            color={tag.color}
                                                            style={{ fontSize: '11px', padding: '2px 6px' }}
                                                        >
                                                            {tag.name}
                                                        </Tag>
                                                    ))}
                                                    {blog.tags.length > 3 && (
                                                        <Tag style={{ fontSize: '11px', padding: '2px 6px' }}>
                                                            +{blog.tags.length - 3}
                                                        </Tag>
                                                    )}
                                                </Space>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <div className="blog-pagination">
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={filteredBlogs.length}
                            onChange={handlePageChange}
                            showSizeChanger
                            showTotal={(total) => `Total ${total} blogs`}
                            pageSizeOptions={[4, 8, 12, 16]}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default Blog;