import axios from '../axios.customize';

const signUpApi = (userData) => {
    const URL_API = "/v1/api/account/register";
    return axios.post(URL_API, userData);
};

const loginApi = (username, password) => {
    const URL_API = "/v1/api/account/login";
    const data = {
        username: username,
        password: password,
    };

    return axios.post(URL_API, data);
};

const getAccountApi = () => {
    const URL_API = "/v1/api/account/get-account";
    return axios.get(URL_API);
};

const updateProfileApi = (profileData) => {
    const URL_API = "/v1/api/account/profile";
    const data = {
        username: profileData.username,
        fullName: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone,
        dob: profileData.dob,
        gender: profileData.gender,
        categories: profileData.categories || [],
    };
    return axios.put(URL_API, data);
};

const googleLoginApi = ({ idToken = null, accessToken = null } = {}) => {
    const URL_API = "/v1/api/account/google-login";
    return axios.post(URL_API, { idToken, accessToken });
};

const requestPasswordResetApi = (email) => {
    const URL_API = "/v1/api/account/forgot-password";
    return axios.post(URL_API, { email });
};

const verifyOtpApi = (email, otp) => {
    const URL_API = "/v1/api/account/verify-otp";
    return axios.post(URL_API, { email, otp });
};

const resetPasswordApi = (resetToken, newPassword) => {
    const URL_API = "/v1/api/account/reset-password";
    return axios.post(URL_API, { resetToken, newPassword });
};

export { signUpApi, loginApi, getAccountApi, updateProfileApi, googleLoginApi, requestPasswordResetApi, verifyOtpApi, resetPasswordApi };