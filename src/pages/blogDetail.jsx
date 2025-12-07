import { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Space, Avatar, Tag } from "antd";
import { ArrowLeftOutlined, EyeOutlined, HeartOutlined, UserOutlined, FolderOutlined, TagOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { getBlogByIdApi, likeBlogApi, incrementBlogViewsApi } from "../utils/Api/blogApi";
import { AuthContext } from "../context/auth.context";
import CommentSection from "../components/commentSection";
import AnotherBlogs from "../components/anotherBlogs";
import "../styles/blogDetail.css";

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liking, setLiking] = useState(false);
    const viewCountedRef = useRef(new Set());

    useEffect(() => {
        fetchBlogDetail();
    }, [id]);

    const fetchBlogDetail = async () => {
        setLoading(true);
        try {
            const res = await getBlogByIdApi(id);
            if (res && res.EC === 0) {
                setBlog(res.data);
                await handleIncrementView(id);
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

    const handleIncrementView = async (blogId) => {
        try {
            if (viewCountedRef.current.has(blogId)) {
                console.log('Already counted in this render - skipping (Strict Mode protection)');
                return;
            }

            viewCountedRef.current.add(blogId);

            const viewedBlogs = JSON.parse(sessionStorage.getItem('viewedBlogs') || '[]');

            if (!viewedBlogs.includes(blogId)) {
                await incrementBlogViewsApi(blogId);
                viewedBlogs.push(blogId);
                sessionStorage.setItem('viewedBlogs', JSON.stringify(viewedBlogs));
                console.log('View counted for blog:', blogId);
            } else {
                console.log('Blog already viewed in this session - skipping');
            }
        } catch (error) {
            console.error("Increment view error:", error);
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
                const blogRes = await getBlogByIdApi(id);
                if (blogRes && blogRes.EC === 0) {
                    setBlog(blogRes.data);
                }
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

                {loading ? (
                    // Skeleton Loading
                    <Card className="blog-detail-card">
                        {/* Blog Header Skeleton */}
                        <div className="blog-detail-header">
                            <Skeleton height={40} width="80%" style={{ marginBottom: 20 }} />
                            <Skeleton width={200} style={{ marginBottom: 20 }} />

                            <div className="blog-detail-author-section">
                                <Space size="middle">
                                    <Skeleton circle width={50} height={50} />
                                    <div>
                                        <Skeleton width={150} height={20} style={{ marginBottom: 8 }} />
                                        <Skeleton width={100} height={24} />
                                    </div>
                                </Space>
                            </div>

                            {/* Tags Skeleton */}
                            <div className="blog-detail-tags" style={{ marginTop: 20 }}>
                                <Space size={[8, 8]} wrap>
                                    <Skeleton width={60} height={24} count={3} inline style={{ marginRight: 8 }} />
                                </Space>
                            </div>
                        </div>

                        {/* Blog Image Skeleton */}
                        <div className="blog-detail-image">
                            <Skeleton height={400} />
                        </div>

                        {/* Blog Stats Skeleton */}
                        <div className="blog-detail-stats">
                            <Space size="large">
                                <Skeleton width={100} height={20} />
                                <Skeleton width={100} height={20} />
                            </Space>
                        </div>

                        {/* Blog Content Skeleton */}
                        <div className="blog-detail-content">
                            <Skeleton count={10} style={{ marginBottom: 10 }} />
                        </div>
                    </Card>
                ) : !blog ? null : (
                    // Actual Content
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
                                <Space size="middle" wrap>
                                    <Space>
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
                                </Space>
                            </div>

                            {/* Blog Tags */}
                            {blog.tags && blog.tags.length > 0 && (
                                <div className="blog-detail-tags">
                                    <Space size={[8, 8]} wrap>
                                        <TagOutlined style={{ fontSize: '16px', color: '#64b5f6' }} />
                                        {blog.tags.map((tag) => (
                                            <Tag
                                                key={tag._id}
                                                color={tag.color}
                                                style={{
                                                    fontSize: '13px',
                                                    padding: '4px 10px',
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => navigate(`/blog?tag=${tag._id}`)}
                                            >
                                                {tag.name}
                                            </Tag>
                                        ))}
                                    </Space>
                                </div>
                            )}
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
                )}

                <CommentSection blogId={id} />

                <AnotherBlogs currentBlogId={id} />
            </div>
        </div>
    );
};

export default BlogDetail;