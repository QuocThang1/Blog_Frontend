import axios from '../axios.customize';

const uploadImageApi = (file) => {
    const URL_API = "/v1/api/upload";
    const formData = new FormData();
    formData.append('image', file);

    return axios.post(URL_API, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

const deleteImageApi = (publicId) => {
    const URL_API = "/v1/api/upload";
    return axios.delete(URL_API, { data: { publicId } });
};

export { uploadImageApi, deleteImageApi };