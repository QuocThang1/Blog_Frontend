import axios from '../axios.customize';

const API_BASE = '/v1/api/admin';

export const getUserInsights = (userId) => {
    return axios.get(`${API_BASE}/insights/${userId}`);
};

export const flagContent = (contentType, contentId) => {
    return axios.post(`${API_BASE}/flag-content`, { contentType, contentId });
};

export const getModerationQueue = (status = 'pending', limit = 20, page = 1) => {
    return axios.get(`${API_BASE}/moderation-queue`, {
        params: { status, limit, page }
    });
};

export const reviewModeration = (recordId, action, notes = '') => {
    return axios.put(`${API_BASE}/moderation/${recordId}/review`, {
        action,
        notes
    });
};

export const runSegmentation = () => {
    return axios.post(`${API_BASE}/run-segmentation`);
};

export const getSegmentAnalysis = (segment) => {
    return axios.get(`${API_BASE}/segment/${segment}`);
};

export const getUserRecommendations = (userId) => {
    return axios.get(`${API_BASE}/recommendations/${userId}`);
};

export const generateReport = (reportType = 'daily') => {
    return axios.post(`${API_BASE}/generate-report`, { reportType });
};

export const getPlatformStats = (period = 'daily') => {
    return axios.get(`${API_BASE}/platform-stats`, {
        params: { period }
    });
};

export const getDashboardSummary = () => {
    return axios.get(`${API_BASE}/dashboard`);
};
