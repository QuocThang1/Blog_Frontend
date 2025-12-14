import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Tag, Space, Avatar } from "antd";
import { ArrowLeftOutlined, EyeOutlined, HeartOutlined, HeartFilled, UserOutlined, CalendarOutlined, FolderOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { getBlogByIdApi } from "../../../utils/Api/blogApi";
import { toggleLikeBlogApi, checkUserLikedApi } from "../../../utils/Api/likeApi";
import Spinner from "../../../components/spinner";
import "../../../styles/blogDetailManagement.css";

const BlogDetailManagement = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liking, setLiking] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    useEffect(() => {
        fetchBlogDetail();
    }, [id]);

    const fetchBlogDetail = async () => {
        setLoading(true);
        try {
            const res = await getBlogByIdApi(id);
            if (res && res.EC === 0) {
                setBlog(res.data);
                setLikesCount(res.data.likesCount || 0);
                await checkLikeStatus();
            } else {
                toast.error(res.EM || "Failed to fetch blog");
                navigate(-1);
            }
        } catch (error) {
            console.error("Fetch blog detail error:", error);
            toast.error("Failed to fetch blog");
            navigate(-1);
        } finally {
            setLoading(false);
        }
    };

    const checkLikeStatus = async () => {
        try {
            const res = await checkUserLikedApi(id);
            if (res && res.EC === 0) {
                setIsLiked(res.data.isLiked);
                setLikesCount(res.data.likesCount);
            }
        } catch (error) {
            console.error("Check like status error:", error);
        }
    };

    const handleLike = async () => {
        setLiking(true);
        try {
            const res = await toggleLikeBlogApi(id);
            if (res && res.EC === 0) {
                setIsLiked(res.data.isLiked);
                setLikesCount(res.data.likesCount);
                toast.success(res.data.isLiked ? "Liked!" : "Unliked!");
            } else {
                toast.error(res.EM || "Failed to like blog");
            }
        } catch (error) {
            console.error("Like blog error:", error);
            toast.error(error?.response?.data?.EM || "Failed to like blog");
        } finally {
            setLiking(false);
        }
    };

    if (loading) {
        return <Spinner />;
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
                    onClick={() => navigate(-1)}
                    className="back-button"
                    size="large"
                >
                    Back
                </Button>

                <Card className="blog-detail-card">
                    {blog.image && (
                        <div className="blog-detail-image">
                            <img src={blog.image} alt={blog.title} />
                        </div>
                    )}

                    <div className="blog-detail-header">
                        <h1 className="blog-detail-title">{blog.title}</h1>

                        <div className="blog-detail-meta">
                            <Space size="large" wrap>
                                <Space>
                                    <Avatar
                                        size={40}
                                        icon={<UserOutlined />}
                                        src={blog.author?.avatar}
                                    />
                                    <span className="author-name">
                                        {blog.author?.fullName || blog.author?.username || "Unknown"}
                                    </span>
                                </Space>

                                <Space>
                                    <CalendarOutlined />
                                    <span>{new Date(blog.createdAt).toLocaleDateString("vi-VN", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                    })}</span>
                                </Space>

                                {blog.category && (
                                    <Space>
                                        <FolderOutlined />
                                        <Tag color="green">{blog.category.name}</Tag>
                                    </Space>
                                )}

                                {blog.tags && blog.tags.length > 0 && (
                                    <Space>
                                        <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Tags:</span>
                                        <Space size={[0, 4]} wrap>
                                            {blog.tags.map((tag) => (
                                                <Tag key={tag._id} color={tag.color}>
                                                    {tag.name}
                                                </Tag>
                                            ))}
                                        </Space>
                                    </Space>
                                )}
                            </Space>
                        </div>

                        <div className="blog-detail-stats">
                            <Space size="large">
                                <span>
                                    <EyeOutlined style={{ marginRight: 5, color: "#64b5f6" }} />
                                    {blog.views || 0} views
                                </span>
                                <Button
                                    type="text"
                                    icon={isLiked ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                                    onClick={handleLike}
                                    loading={liking}
                                    className={`like-button ${isLiked ? 'liked' : ''}`}
                                >
                                    {likesCount} {likesCount === 1 ? 'like' : 'likes'}
                                </Button>
                            </Space>
                        </div>
                    </div>

                    <div className="blog-detail-description">
                        <p>{blog.description}</p>
                    </div>

                    <div className="blog-detail-content">
                        {blog.content.split('\n').map((paragraph, index) => (
                            paragraph.trim() && <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default BlogDetailManagement;