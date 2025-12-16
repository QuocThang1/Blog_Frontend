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
import "../styles/chatBox.css";

const { TextArea } = Input;

const ChatBox = ({ isOpen, onClose, socketRef }) => {
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
    
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const selectedPartnerRef = useRef(null);

    // Keep selectedPartner ref in sync
    useEffect(() => {
        selectedPartnerRef.current = selectedPartner;
    }, [selectedPartner]);

    // Setup socket listeners for chat (using socket from Header)
    useEffect(() => {
        if (!socketRef?.current || !auth.isAuthenticated) return;

        const socket = socketRef.current;

        // Handler for new messages
        const handleNewMessage = (message) => {
            // Update messages if in current conversation
            const partner = selectedPartnerRef.current;
            if (partner && 
                (message.sender._id === partner._id || 
                 message.receiver._id === partner._id)) {
                setMessages(prev => {
                    // Avoid duplicates
                    if (prev.some(m => m._id === message._id)) return prev;
                    return [...prev, message];
                });
            }
            // Refresh conversations list
            fetchConversations();
        };

        // Handler for sent message confirmation
        const handleMessageSent = (message) => {
            setMessages(prev => {
                // Avoid duplicates
                if (prev.some(m => m._id === message._id)) return prev;
                return [...prev, message];
            });
        };

        // Handler for typing indicator
        const handleUserTyping = (data) => {
            const partner = selectedPartnerRef.current;
            if (partner && data.userId === partner._id) {
                setTypingUser(data);
                setIsTyping(true);
            }
        };

        // Handler for stop typing
        const handleUserStopTyping = (data) => {
            const partner = selectedPartnerRef.current;
            if (partner && data.userId === partner._id) {
                setIsTyping(false);
                setTypingUser(null);
            }
        };

        // Register listeners
        socket.on('newMessage', handleNewMessage);
        socket.on('messageSent', handleMessageSent);
        socket.on('userTyping', handleUserTyping);
        socket.on('userStopTyping', handleUserStopTyping);

        // Cleanup listeners on unmount
        return () => {
            socket.off('newMessage', handleNewMessage);
            socket.off('messageSent', handleMessageSent);
            socket.off('userTyping', handleUserTyping);
            socket.off('userStopTyping', handleUserStopTyping);
        };
    }, [socketRef?.current, auth.isAuthenticated]);

    // Fetch conversations on open
    useEffect(() => {
        if (isOpen && auth.isAuthenticated) {
            fetchConversations();
        }
    }, [isOpen, auth.isAuthenticated]);

    // Scroll to bottom when messages change
    useEffect(() => {
        // Use setTimeout to ensure DOM has updated
        const timer = setTimeout(() => {
            scrollToBottom();
        }, 100);
        return () => clearTimeout(timer);
    }, [messages]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
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
                // Scroll to bottom after messages loaded
                setTimeout(() => scrollToBottom(), 150);
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
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    // Format for conversation list (shows date only for older messages)
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return formatTime(dateString);
        } else if (date.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        } else {
            return date.toLocaleDateString('en-US', { 
                day: '2-digit', 
                month: '2-digit' 
            });
        }
    };

    // Format for message bubbles (shows date + time for older messages)
    const formatMessageTime = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const time = date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        if (date.toDateString() === today.toDateString()) {
            return time;
        } else if (date.toDateString() === yesterday.toDateString()) {
            return `Yesterday, ${time}`;
        } else {
            const dateStr = date.toLocaleDateString('en-US', { 
                day: '2-digit', 
                month: '2-digit' 
            });
            return `${dateStr}, ${time}`;
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
                        {view === "conversations" && "Messages"}
                        {view === "users" && "Users"}
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
                                        + New Conversation
                                    </Button>
                                    
                                    {conversations.length === 0 ? (
                                        <Empty 
                                            description="No conversations yet"
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
                                        placeholder="Search users..."
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
                                        ← Back to messages
                                    </Button>
                                    
                                    {filteredUsers.length === 0 ? (
                                        <Empty 
                                            description="No users found"
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
                                                <p>Start a conversation</p>
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
                                                        {formatMessageTime(msg.createdAt)}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                        {isTyping && (
                                            <div className="chatbox-typing-indicator">
                                                {typingUser?.fullName || typingUser?.username} is typing...
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
                                            placeholder="Type a message..."
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
