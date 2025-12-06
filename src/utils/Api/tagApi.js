import axios from '../axios.customize';

const getAllTagsApi = () => {
    const URL_API = "/v1/api/tags";
    return axios.get(URL_API);
};

const getTagByIdApi = (tagId) => {
    const URL_API = `/v1/api/tags/${tagId}`;
    return axios.get(URL_API);
};

const searchTagsApi = (keyword) => {
    const URL_API = `/v1/api/tags/search?keyword=${keyword}`;
    return axios.get(URL_API);
};

const createTagApi = (tagData) => {
    const URL_API = "/v1/api/tags";
    const data = {
        name: tagData.name,
        description: tagData.description,
        color: tagData.color,
    };
    return axios.post(URL_API, data);
};

const updateTagApi = (tagId, tagData) => {
    const URL_API = `/v1/api/tags/${tagId}`;
    const data = {
        name: tagData.name,
        description: tagData.description,
        color: tagData.color,
    };
    return axios.put(URL_API, data);
};

const deleteTagApi = (tagId) => {
    const URL_API = `/v1/api/tags/${tagId}`;
    return axios.delete(URL_API);
};

export {
    getAllTagsApi,
    getTagByIdApi,
    searchTagsApi,
    createTagApi,
    updateTagApi,
    deleteTagApi,
};