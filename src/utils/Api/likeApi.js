import axios from '../axios.customize';

const toggleLikeBlogApi = (blogId) => {
    const URL_API = `/v1/api/likes/blogs/${blogId}`;
    return axios.post(URL_API);
};

const getLikesCountApi = (blogId) => {
    const URL_API = `/v1/api/likes/blogs/${blogId}/count`;
    return axios.get(URL_API);
};

const getUsersWhoLikedApi = (blogId) => {
    const URL_API = `/v1/api/likes/blogs/${blogId}/users`;
    return axios.get(URL_API);
};

const checkUserLikedApi = (blogId) => {
    const URL_API = `/v1/api/likes/blogs/${blogId}/check`;
    return axios.get(URL_API);
};

const getMyLikedBlogsApi = () => {
    const URL_API = "/v1/api/likes/my-liked-blogs";
    return axios.get(URL_API);
};

export {
    toggleLikeBlogApi,
    getLikesCountApi,
    getUsersWhoLikedApi,
    checkUserLikedApi,
    getMyLikedBlogsApi,
};