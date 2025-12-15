import { useState, useEffect, useContext, useRef } from "react";
import { Input, Button, Avatar, Empty, Spin, Badge } from "antd";
import { 
    UserOutlined, 
    SendOutlined, 
    CloseOutlined, 
    ArrowLeftOutlined,
    SearchOutlined 
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { AuthContext } from "../context/auth.context";
import { 
    getConversationsApi, 
    getMessagesApi, 
    sendMessageApi,
    getAllUsersApi 
} from "../utils/Api/chatApi";
import io from "socket.io-client";
import "../styles/chatBox.css";

const { TextArea } = Input;

const ChatBox = ({ isOpen, onClose }) => {
    const { auth } = useContext(AuthContext);
    const [view, setView] = useState("conversations"); // "conversations" | "chat" | "users"
    const [conversations, setConversations] = useState([]);
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [messageText, setMessageText] = useState("");
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState(null);
    
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    // Initialize socket connection
    useEffect(() => {
        if (!auth.isAuthenticated || !isOpen) return;

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

        socketRef.current.emit('joinChat');

        // Listen for new messages
        socketRef.current.on('newMessage', (message) => {
            // Update messages if in current conversation
            if (selectedPartner && 
                (message.sender._id === selectedPartner._id || 
                 message.receiver._id === selectedPartner._id)) {
                setMessages(prev => [...prev, message]);
            }
            // Refresh conversations list
            fetchConversations();
        });

        // Listen for sent message confirmation
        socketRef.current.on('messageSent', (message) => {
            setMessages(prev => [...prev, message]);
        });

        // Typing indicators
        socketRef.current.on('userTyping', (data) => {
            if (selectedPartner && data.userId === selectedPartner._id) {
                setTypingUser(data);
                setIsTyping(true);
            }
        });

        socketRef.current.on('userStopTyping', (data) => {
            if (selectedPartner && data.userId === selectedPartner._id) {
                setIsTyping(false);
                setTypingUser(null);
            }
        });

        socketRef.current.on('connect_error', (error) => {
            console.error('Chat socket connection error:', error);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.emit('leaveChat');
                socketRef.current.disconnect();
            }
        };
    }, [auth.isAuthenticated, isOpen]);

    // Fetch conversations on open
    useEffect(() => {
        if (isOpen && auth.isAuthenticated) {
            fetchConversations();
        }
    }, [isOpen, auth.isAuthenticated]);

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchConversations = async () => {
        setLoading(true);
        try {
            const res = await getConversationsApi();
            if (res && res.success) {
                setConversations(res.data.conversations || []);
            }
        } catch (error) {
            console.error("Fetch conversations error:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await getAllUsersApi();
            if (res && res.EC === 0) {
                setUsers(res.data || []);
            }
        } catch (error) {
            console.error("Fetch users error:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (partnerId) => {
        setLoading(true);
        try {
            const res = await getMessagesApi(partnerId);
            if (res && res.success) {
                setMessages(res.data.messages || []);
            }
        } catch (error) {
            console.error("Fetch messages error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectConversation = (conversation) => {
        setSelectedPartner(conversation.partner);
        fetchMessages(conversation.partner._id);
        setView("chat");
    };

    const handleSelectUser = (user) => {
        setSelectedPartner(user);
        fetchMessages(user._id);
        setView("chat");
    };

    const handleNewChat = () => {
        fetchUsers();
        setView("users");
    };

    const handleBackToConversations = () => {
        setSelectedPartner(null);
        setMessages([]);
        setView("conversations");
        fetchConversations();
    };

    const handleSendMessage = async () => {
        if (!messageText.trim() || !selectedPartner) return;

        setSending(true);
        try {
            const res = await sendMessageApi(selectedPartner._id, messageText.trim());
            if (res && res.success) {
                setMessageText("");
                // Message will be added via socket event
            } else {
                toast.error(res?.message || "Failed to send message");
            }
        } catch (error) {
            console.error("Send message error:", error);
            toast.error("Failed to send message");
        } finally {
            setSending(false);
        }
    };

    const handleTyping = () => {
        if (!socketRef.current || !selectedPartner) return;

        socketRef.current.emit('typing', { receiverId: selectedPartner._id });

        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Stop typing after 2 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
            socketRef.current.emit('stopTyping', { receiverId: selectedPartner._id });
        }, 2000);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const filteredUsers = users.filter(user => 
        user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return formatTime(dateString);
        } else if (date.toDateString() === yesterday.toDateString()) {
            return "Hôm qua";
        } else {
            return date.toLocaleDateString('vi-VN', { 
                day: '2-digit', 
                month: '2-digit' 
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="chatbox-overlay">
            <div className="chatbox-container">
                {/* Header */}
                <div className="chatbox-header">
                    {view === "chat" && (
                        <Button 
                            type="text" 
                            icon={<ArrowLeftOutlined />} 
                            onClick={handleBackToConversations}
                            className="chatbox-back-btn"
                        />
                    )}
                    <h3 className="chatbox-title">
                        {view === "conversations" && "Tin nhắn"}
                        {view === "users" && "Người dùng"}
                        {view === "chat" && (selectedPartner?.fullName || selectedPartner?.username)}
                    </h3>
                    <Button 
                        type="text" 
                        icon={<CloseOutlined />} 
                        onClick={onClose}
                        className="chatbox-close-btn"
                    />
                </div>

                {/* Content */}
                <div className="chatbox-content">
                    {loading ? (
                        <div className="chatbox-loading">
                            <Spin size="large" />
                        </div>
                    ) : (
                        <>
                            {/* Conversations List */}
                            {view === "conversations" && (
                                <div className="chatbox-conversations">
                                    <Button 
                                        type="primary" 
                                        block 
                                        onClick={handleNewChat}
                                        className="chatbox-new-chat-btn"
                                    >
                                        + Cuộc trò chuyện mới
                                    </Button>
                                    
                                    {conversations.length === 0 ? (
                                        <Empty 
                                            description="Chưa có cuộc trò chuyện nào"
                                            className="chatbox-empty"
                                        />
                                    ) : (
                                        <div className="chatbox-conversation-list">
                                            {conversations.map((conv) => (
                                                <div 
                                                    key={conv.conversationId}
                                                    className="chatbox-conversation-item"
                                                    onClick={() => handleSelectConversation(conv)}
                                                >
                                                    <Avatar 
                                                        size={45} 
                                                        icon={<UserOutlined />}
                                                        className="chatbox-avatar"
                                                    />
                                                    <div className="chatbox-conversation-info">
                                                        <div className="chatbox-conversation-header">
                                                            <span className="chatbox-conversation-name">
                                                                {conv.partner?.fullName || conv.partner?.username}
                                                            </span>
                                                            <span className="chatbox-conversation-time">
                                                                {formatDate(conv.updatedAt)}
                                                            </span>
                                                        </div>
                                                        <div className="chatbox-conversation-preview">
                                                            {conv.lastMessage?.content?.substring(0, 30)}
                                                            {conv.lastMessage?.content?.length > 30 ? "..." : ""}
                                                        </div>
                                                    </div>
                                                    {conv.unreadCount > 0 && (
                                                        <Badge 
                                                            count={conv.unreadCount} 
                                                            className="chatbox-unread-badge"
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Users List */}
                            {view === "users" && (
                                <div className="chatbox-users">
                                    <Input
                                        placeholder="Tìm kiếm người dùng..."
                                        prefix={<SearchOutlined />}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="chatbox-search-input"
                                    />
                                    <Button 
                                        type="text" 
                                        onClick={handleBackToConversations}
                                        className="chatbox-back-link"
                                    >
                                        ← Quay lại tin nhắn
                                    </Button>
                                    
                                    {filteredUsers.length === 0 ? (
                                        <Empty 
                                            description="Không tìm thấy người dùng"
                                            className="chatbox-empty"
                                        />
                                    ) : (
                                        <div className="chatbox-user-list">
                                            {filteredUsers.map((user) => (
                                                <div 
                                                    key={user._id}
                                                    className="chatbox-user-item"
                                                    onClick={() => handleSelectUser(user)}
                                                >
                                                    <Avatar 
                                                        size={40} 
                                                        icon={<UserOutlined />}
                                                        className="chatbox-avatar"
                                                    />
                                                    <div className="chatbox-user-info">
                                                        <span className="chatbox-user-name">
                                                            {user.fullName}
                                                        </span>
                                                        <span className="chatbox-user-username">
                                                            @{user.username}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Chat View */}
                            {view === "chat" && (
                                <div className="chatbox-chat">
                                    <div className="chatbox-messages">
                                        {messages.length === 0 ? (
                                            <div className="chatbox-no-messages">
                                                <p>Bắt đầu cuộc trò chuyện</p>
                                            </div>
                                        ) : (
                                            messages.map((msg, index) => (
                                                <div 
                                                    key={msg._id || index}
                                                    className={`chatbox-message ${
                                                        msg.sender._id === auth.user._id 
                                                            ? 'chatbox-message-sent' 
                                                            : 'chatbox-message-received'
                                                    }`}
                                                >
                                                    <div className="chatbox-message-content">
                                                        {msg.content}
                                                    </div>
                                                    <div className="chatbox-message-time">
                                                        {formatTime(msg.createdAt)}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                        {isTyping && (
                                            <div className="chatbox-typing-indicator">
                                                {typingUser?.fullName || typingUser?.username} đang gõ...
                                            </div>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    <div className="chatbox-input-area">
                                        <TextArea
                                            value={messageText}
                                            onChange={(e) => {
                                                setMessageText(e.target.value);
                                                handleTyping();
                                            }}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Nhập tin nhắn..."
                                            autoSize={{ minRows: 1, maxRows: 3 }}
                                            className="chatbox-input"
                                        />
                                        <Button
                                            type="primary"
                                            icon={<SendOutlined />}
                                            onClick={handleSendMessage}
                                            loading={sending}
                                            disabled={!messageText.trim()}
                                            className="chatbox-send-btn"
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
