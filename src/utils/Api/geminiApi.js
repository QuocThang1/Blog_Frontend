import axios from '../axios.customize';

// Tóm tắt bài viết thành 3 gạch đầu dòng
const summaryBlogApi = (blogContent) => {
    const URL_API = "/v1/api/gemini/summary-blog";
    return axios.post(URL_API, { blog_content: blogContent });
};

// Generate text từ prompt
const generateTextApi = (prompt) => {
    const URL_API = "/v1/api/gemini/generate";
    return axios.post(URL_API, { prompt });
};

// Chat với Gemini
const chatWithGeminiApi = (message, history = []) => {
    const URL_API = "/v1/api/gemini/chat";
    return axios.post(URL_API, { message, history });
};

// Tạo summary cho blog (với maxLength tùy chỉnh)
const generateBlogSummaryApi = (content, maxLength = 200) => {
    const URL_API = "/v1/api/gemini/blog/summary";
    return axios.post(URL_API, { content, maxLength });
};

// Generate tags cho blog
const generateBlogTagsApi = (title, content) => {
    const URL_API = "/v1/api/gemini/blog/tags";
    return axios.post(URL_API, { title, content });
};

export {
    summaryBlogApi,
    generateTextApi,
    chatWithGeminiApi,
    generateBlogSummaryApi,
    generateBlogTagsApi
};
