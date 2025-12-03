import axios from '../axios.customize';

const getAllBlogsApi = () => {
    const URL_API = "/v1/api/blogs";
    return axios.get(URL_API);
};

const getBlogByIdApi = (blogId) => {
    const URL_API = `/v1/api/blogs/${blogId}`;
    return axios.get(URL_API);
};

const getBlogsByCategoryApi = (categoryId) => {
    const URL_API = `/v1/api/blogs/category/${categoryId}`;
    return axios.get(URL_API);
};

const getMyBlogsApi = () => {
    const URL_API = "/v1/api/blogs/my-blogs";
    return axios.get(URL_API);
};

const createBlogApi = (blogData) => {
    const URL_API = "/v1/api/blogs";
    const data = {
        title: blogData.title,
        description: blogData.description,
        content: blogData.content,
        image: blogData.image,
        imagePublicId: blogData.imagePublicId,
        categoryId: blogData.categoryId,
    };
    return axios.post(URL_API, data);
};

const updateBlogApi = (blogId, blogData) => {
    const URL_API = `/v1/api/blogs/${blogId}`;
    const data = {
        title: blogData.title,
        description: blogData.description,
        content: blogData.content,
        image: blogData.image,
        imagePublicId: blogData.imagePublicId,
        categoryId: blogData.categoryId,
    };
    return axios.put(URL_API, data);
};

const deleteBlogApi = (blogId) => {
    const URL_API = `/v1/api/blogs/${blogId}`;
    return axios.delete(URL_API);
};

const likeBlogApi = (blogId) => {
    const URL_API = `/v1/api/blogs/${blogId}/like`;
    return axios.post(URL_API);
};

export {
    getAllBlogsApi,
    getBlogByIdApi,
    getBlogsByCategoryApi,
    getMyBlogsApi,
    createBlogApi,
    updateBlogApi,
    deleteBlogApi,
    likeBlogApi,
};
