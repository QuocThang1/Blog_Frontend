import { useState, useEffect } from "react";
import { Card, Row, Col, Tag, Avatar, Empty } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllBlogsApi } from "../utils/Api/blogApi";
import "../styles/anotherBlogs.css";

const AnotherBlogs = ({ currentBlogId }) => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAnotherBlogs();
    }, [currentBlogId]);

    const fetchAnotherBlogs = async () => {
        setLoading(true);
        try {
            const res = await getAllBlogsApi();
            if (res && res.EC === 0) {
                const filteredBlogs = (res.data || [])
                    .filter(blog => blog._id !== currentBlogId)
                    .slice(0, 3);
                setBlogs(filteredBlogs);
            } else {
                toast.error(res.message || "Failed to fetch blogs");
            }
        } catch (error) {
            console.error("Fetch another blogs error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || blogs.length === 0) {
        return null;
    }

    return (
        <Card className="another-blogs-card" title="Another Blogs">
            <Row gutter={[24, 24]}>
                {blogs.map((blog) => (
                    <Col xs={24} sm={12} lg={8} key={blog._id}>
                        <Card
                            hoverable
                            className="another-blog-card"
                            cover={
                                <div className="another-blog-image">
                                    <img alt={blog.title} src={blog.image} />
                                </div>
                            }
                            onClick={() => {
                                navigate(`/blog/${blog._id}`);
                                window.scrollTo(0, 0);
                            }}
                        >
                            <h3 className="another-blog-title">{blog.title}</h3>
                            <div className="another-blog-meta">
                                <Avatar size="small" icon={<UserOutlined />} />
                                <span className="another-blog-author">
                                    {blog.author?.fullName || blog.author?.username || "Unknown"}
                                </span>
                            </div>
                            {blog.category && (
                                <Tag className="another-blog-category">
                                    {blog.category.name}
                                </Tag>
                            )}
                        </Card>
                    </Col>
                ))}
            </Row>
        </Card>
    );
};

export default AnotherBlogs;