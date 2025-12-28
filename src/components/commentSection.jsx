import { useState, useEffect, useContext, useRef } from "react";
import { Card, Input, Button, Avatar, Empty } from "antd";
import { UserOutlined, SendOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import Skeleton from 'react-loading-skeleton';
import { createCommentApi, getCommentsByBlogApi } from "../utils/Api/commentApi";
import { AuthContext } from "../context/auth.context";
import io from "socket.io-client";
import "../styles/commentSection.css";

const { TextArea } = Input;

const CommentSection = ({ blogId }) => {
    const { auth } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [commentText, setCommentText] = useState("");
    const socketRef = useRef(null);

    useEffect(() => {
        fetchComments();

        const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
        const token = localStorage.getItem("access_token");
        socketRef.current = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            auth: { token },
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5
        });

        socketRef.current.emit('joinBlog', blogId);

        socketRef.current.on('newComment', (data) => {
            if (data.blogId === blogId) {
                setComments(prevComments => [data.comment, ...prevComments]);
            }
        });

        socketRef.current.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.emit('leaveBlog', blogId);
                socketRef.current.disconnect();
            }
        };
    }, [blogId]);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const res = await getCommentsByBlogApi(blogId);
            if (res && res.EC === 0) {
                setComments(res.data || []);
            } else {
                toast.error(res.message || "Failed to fetch comments");
            }
        } catch (error) {
            console.error("Fetch comments error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = async () => {
        if (!commentText.trim()) {
            toast.warning("Please enter your comment");
            return;
        }

        setSubmitting(true);
        try {
            const res = await createCommentApi({
                content: commentText,
                blogId: blogId
            });

            if (res && res.EC === 0) {
                toast.success("Comment posted successfully");
                setCommentText("");
            } else {
                toast.error(res.message || "Failed to post comment");
            }
        } catch (error) {
            console.error("Post comment error:", error);
            toast.error(error?.response?.data?.EM || "Failed to post comment");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card className="comment-section-card" title="Comments">
            {/* Comment Input */}
            {auth.isAuthenticated ? (
                <div className="comment-input-wrapper">
                    <Avatar icon={<UserOutlined />} className="comment-avatar" />
                    <div className="comment-input-box">
                        <TextArea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write your comment..."
                            autoSize={{ minRows: 2, maxRows: 6 }}
                            className="comment-textarea"
                        />
                        <Button
                            type="primary"
                            icon={<SendOutlined />}
                            onClick={handleSubmitComment}
                            loading={submitting}
                            className="comment-submit-btn"
                        >
                            Post Comment
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="comment-login-notice">
                    <p>Please login to comment</p>
                </div>
            )}

            {/* Comments List */}
            <div className="comment-list">
                {loading ? (
                    // Skeleton for comments
                    Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="comment-item">
                            <Skeleton circle width={40} height={40} />
                            <div className="comment-content" style={{ flex: 1 }}>
                                <Skeleton width={150} height={20} style={{ marginBottom: 8 }} />
                                <Skeleton count={2} />
                            </div>
                        </div>
                    ))
                ) : comments.length === 0 ? (
                    <Empty description="No comments yet" />
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="comment-item">
                            <Avatar
                                icon={<UserOutlined />}
                                src={comment.author?.avatar}
                                className="comment-avatar"
                            />
                            <div className="comment-content">
                                <div className="comment-header">
                                    <span className="comment-author">
                                        {comment.author?.fullName || comment.author?.username || "Unknown"}
                                    </span>
                                    <span className="comment-date">
                                        {new Date(comment.createdAt).toLocaleDateString("vi-VN", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </span>
                                </div>
                                <p className="comment-text">{comment.content}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
};

export default CommentSection;