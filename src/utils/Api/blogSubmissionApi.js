import axios from '../axios.customize';

const createSubmissionApi = (link) => {
    const URL_API = "/v1/api/submissions";
    return axios.post(URL_API, { link });
};

const getMySubmissionsApi = () => {
    const URL_API = "/v1/api/submissions/my-submissions";
    return axios.get(URL_API);
};

const getAllSubmissionsApi = () => {
    const URL_API = "/v1/api/submissions";
    return axios.get(URL_API);
};

const getSubmissionsByStatusApi = (status) => {
    const URL_API = `/v1/api/submissions/status/${status}`;
    return axios.get(URL_API);
};

const getSubmissionsStatsApi = () => {
    const URL_API = "/v1/api/submissions/stats";
    return axios.get(URL_API);
};

const approveSubmissionApi = (submissionId) => {
    const URL_API = `/v1/api/submissions/${submissionId}/approve`;
    return axios.post(URL_API);
};

const rejectSubmissionApi = (submissionId) => {
    const URL_API = `/v1/api/submissions/${submissionId}/reject`;
    return axios.post(URL_API);
};

const deleteSubmissionApi = (submissionId) => {
    const URL_API = `/v1/api/submissions/${submissionId}`;
    return axios.delete(URL_API);
};

export {
    createSubmissionApi,
    getMySubmissionsApi,
    getAllSubmissionsApi,
    getSubmissionsByStatusApi,
    getSubmissionsStatsApi,
    approveSubmissionApi,
    rejectSubmissionApi,
    deleteSubmissionApi,
};