import axios from "../axios.customize";

/**
 * Get all conversations for current user
 */
export const getConversationsApi = (page = 1, limit = 20) => {
    return axios.get(`/v1/api/chat/conversations?page=${page}&limit=${limit}`);
};

/**
 * Get messages in a conversation with specific user
 */
export const getMessagesApi = (partnerId, page = 1, limit = 50) => {
    return axios.get(`/v1/api/chat/messages/${partnerId}?page=${page}&limit=${limit}`);
};

/**
 * Send a message to another user
 */
export const sendMessageApi = (receiverId, content) => {
    return axios.post("/v1/api/chat/send", { receiverId, content });
};

/**
 * Get unread messages count
 */
export const getUnreadCountApi = () => {
    return axios.get("/v1/api/chat/unread");
};

/**
 * Mark conversation as read
 */
export const markAsReadApi = (partnerId) => {
    return axios.put(`/v1/api/chat/read/${partnerId}`);
};

/**
 * Get all users (for starting new conversation)
 */
export const getAllUsersApi = () => {
    return axios.get("/v1/api/users");
};
