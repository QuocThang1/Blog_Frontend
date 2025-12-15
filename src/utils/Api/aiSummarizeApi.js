import axios from '../axios.customize';

/**
 * API cho tính năng tóm tắt bài viết bằng AI
 * Endpoint: /v1/api/ai-summarize
 */

// Tóm tắt bài viết thành 3 gạch đầu dòng
const summaryBlogApi = (blogContent) => {
    const URL_API = "/v1/api/ai-summarize/summary-blog";
    return axios.post(URL_API, { blog_content: blogContent });
};

export {
    summaryBlogApi
};
