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

const getBlogsByTagApi = (tagId) => {
    const URL_API = `/v1/api/blogs/tag/${tagId}`;
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
        tags: blogData.tags || [],
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
        tags: blogData.tags || [],
    };
    return axios.put(URL_API, data);
};

const deleteBlogApi = (blogId) => {
    const URL_API = `/v1/api/blogs/${blogId}`;
    return axios.delete(URL_API);
};

const incrementBlogViewsApi = (blogId) => {
    const URL_API = `/v1/api/blogs/${blogId}/increment-views`;
    return axios.post(URL_API);
}

const getTop5BlogsApi = () => {
    const URL_API = `/v1/api/blogs/top5`;
    return axios.get(URL_API);
}

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
    incrementBlogViewsApi,
    getTop5BlogsApi,
    likeBlogApi,
    getBlogsByTagApi
};
