import axios from '../axios.customize';

const createCommentApi = (commentData) => {
    const URL_API = "/v1/api/comments";
    const data = {
        content: commentData.content,
        blogId: commentData.blogId,
    };
    return axios.post(URL_API, data);
};

const getCommentsByBlogApi = (blogId) => {
    const URL_API = `/v1/api/comments/blogs/${blogId}`;
    return axios.get(URL_API);
};

export { createCommentApi, getCommentsByBlogApi };