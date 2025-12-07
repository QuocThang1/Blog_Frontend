import { useState, useEffect } from "react";
import { Card, Tag, Avatar } from "antd";
import { UserOutlined, EyeOutlined, HeartOutlined, FireOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Skeleton from 'react-loading-skeleton';
import { getTop5BlogsApi } from "../utils/Api/blogApi";
import "../styles/top5Blogs.css";

const Top5Blogs = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTop5Blogs();
    }, []);

    const fetchTop5Blogs = async () => {
        setLoading(true);
        try {
            const res = await getTop5BlogsApi();
            if (res && res.EC === 0) {
                setBlogs(res.data || []);
            } else {
                toast.error(res.message || "Failed to fetch top blogs");
            }
        } catch (error) {
            console.error("Fetch top 5 blogs error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!loading && blogs.length === 0) {
        return null;
    }

    return (
        <div className="top5-blogs-section">
            <div className="top5-header">
                <FireOutlined className="top5-icon" />
                <h2 className="top5-title">Top 5 Blogs</h2>
            </div>

            <div className="top5-blogs-container">
                {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                        <Card key={index} className="top5-blog-card">
                            <div className="top5-rank">{index + 1}</div>
                            <Skeleton height={180} />
                            <div style={{ padding: 16 }}>
                                <Skeleton count={2} />
                                <Skeleton circle width={24} height={24} style={{ marginTop: 10 }} />
                            </div>
                        </Card>
                    ))
                ) : (
                    blogs.map((blog, index) => (
                        <Card
                            key={blog._id}
                            hoverable
                            className="top5-blog-card"
                            onClick={() => navigate(`/blog/${blog._id}`)}
                        >
                            <div className="top5-rank">{index + 1}</div>

                            <div className="top5-blog-image">
                                <img src={blog.image} alt={blog.title} />
                            </div>

                            <div className="top5-blog-content">
                                <h3 className="top5-blog-title">{blog.title}</h3>

                                <div className="top5-blog-meta">
                                    <Avatar size="small" icon={<UserOutlined />} src={blog.author?.avatar} />
                                    <span className="top5-blog-author">
                                        {blog.author?.fullName || blog.author?.username || "Unknown"}
                                    </span>
                                </div>

                                {blog.category && (
                                    <Tag className="top5-blog-category" color="green">
                                        {blog.category.name}
                                    </Tag>
                                )}

                                <div className="top5-blog-stats">
                                    <span className="top5-stat">
                                        <EyeOutlined /> {blog.views || 0}
                                    </span>
                                    <span className="top5-stat">
                                        <HeartOutlined /> {blog.likes || 0}
                                    </span>
                                </div>

                                {blog.tags && blog.tags.length > 0 && (
                                    <div className="top5-blog-tags">
                                        {blog.tags.slice(0, 2).map((tag) => (
                                            <Tag
                                                key={tag._id}
                                                color={tag.color}
                                                style={{ fontSize: '10px', padding: '2px 6px' }}
                                            >
                                                {tag.name}
                                            </Tag>
                                        ))}
                                        {blog.tags.length > 2 && (
                                            <Tag style={{ fontSize: '10px', padding: '2px 6px' }}>
                                                +{blog.tags.length - 2}
                                            </Tag>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default Top5Blogs;