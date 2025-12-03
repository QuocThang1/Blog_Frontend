import axios from '../axios.customize';

const getAllCategoriesApi = () => {
    const URL_API = "/v1/api/categories";
    return axios.get(URL_API);
};

const getCategoryByIdApi = (categoryId) => {
    const URL_API = `/v1/api/categories/${categoryId}`;
    return axios.get(URL_API);
};

const createCategoryApi = (categoryData) => {
    const URL_API = "/v1/api/categories";
    const data = {
        name: categoryData.name,
        description: categoryData.description,
    };
    return axios.post(URL_API, data);
};

const updateCategoryApi = (categoryId, categoryData) => {
    const URL_API = `/v1/api/categories/${categoryId}`;
    const data = {
        name: categoryData.name,
        description: categoryData.description,
    };
    return axios.put(URL_API, data);
};

const deleteCategoryApi = (categoryId) => {
    const URL_API = `/v1/api/categories/${categoryId}`;
    return axios.delete(URL_API);
};

export {
    getAllCategoriesApi,
    getCategoryByIdApi,
    createCategoryApi,
    updateCategoryApi,
    deleteCategoryApi,
};