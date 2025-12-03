import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Space, Spin, Avatar, Tag } from "antd";
import { ArrowLeftOutlined, EyeOutlined, HeartOutlined, UserOutlined, CalendarOutlined, FolderOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { getBlogByIdApi, likeBlogApi } from "../utils/Api/blogApi";
import { AuthContext } from "../context/auth.context";
import CommentSection from "../components/CommentSection";
import AnotherBlogs from "../components/AnotherBlogs";
import "../styles/blogDetail.css";

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liking, setLiking] = useState(false);

    useEffect(() => {
        fetchBlogDetail();
    }, [id]);

    const fetchBlogDetail = async () => {
        setLoading(true);
        try {
            const res = await getBlogByIdApi(id);
            if (res && res.EC === 0) {
                setBlog(res.data);
            } else {
                toast.error(res.message || "Failed to fetch blog");
            }
        } catch (error) {
            console.error("Fetch blog detail error:", error);
            toast.error("Failed to fetch blog");
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        if (!auth.isAuthenticated) {
            toast.warning("Please login to like");
            return;
        }

        setLiking(true);
        try {
            const res = await likeBlogApi(id);
            if (res && res.EC === 0) {
                toast.success("Liked!");
                fetchBlogDetail();
            } else {
                toast.error(res.message || "Failed to like blog");
            }
        } catch (error) {
            console.error("Like blog error:", error);
            toast.error(error?.response?.data?.EM || "Failed to like blog");
        } finally {
            setLiking(false);
        }
    };

    if (loading) {
        return (
            <div className="blog-detail-loading">
                <Spin size="large" />
            </div>
        );
    }

    if (!blog) {
        return null;
    }

    return (
        <div className="blog-detail-wrapper">
            <div className="blog-detail-container">
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate("/blog")}
                    className="back-button"
                    size="large"
                >
                    Back
                </Button>

                <Card className="blog-detail-card">
                    {/* Blog Header */}
                    <div className="blog-detail-header">
                        <h1 className="blog-detail-title">{blog.title}</h1>

                        <div className="blog-detail-date">
                            {new Date(blog.createdAt).toLocaleDateString("vi-VN", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                            })}
                        </div>

                        <div className="blog-detail-author-section">
                            <Space size="middle">
                                <Avatar
                                    size={50}
                                    icon={<UserOutlined />}
                                    src={blog.author?.avatar}
                                />
                                <div>
                                    <div className="author-name">
                                        {blog.author?.fullName || blog.author?.username || "Unknown"}
                                    </div>
                                    {blog.category && (
                                        <Tag color="green" className="category-tag">
                                            <FolderOutlined /> {blog.category.name}
                                        </Tag>
                                    )}
                                </div>
                            </Space>
                        </div>
                    </div>

                    {/* Blog Image */}
                    {blog.image && (
                        <div className="blog-detail-image">
                            <img src={blog.image} alt={blog.title} />
                        </div>
                    )}

                    {/* Blog Stats */}
                    <div className="blog-detail-stats">
                        <Space size="large">
                            <span>
                                <EyeOutlined style={{ marginRight: 5, color: "#64b5f6" }} />
                                {blog.views || 0} views
                            </span>
                            <Button
                                type="text"
                                icon={<HeartOutlined />}
                                onClick={handleLike}
                                loading={liking}
                                className="like-button"
                                disabled={!auth.isAuthenticated}
                            >
                                {blog.likes || 0} likes
                            </Button>
                        </Space>
                    </div>

                    {/* Blog Content */}
                    <div className="blog-detail-content">
                        {blog.content.split('\n').map((paragraph, index) => (
                            paragraph.trim() && <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </Card>

                <CommentSection blogId={id} />

                <AnotherBlogs currentBlogId={id} />
            </div>
        </div>
    );
};

export default BlogDetail;