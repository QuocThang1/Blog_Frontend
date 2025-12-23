// utils/Api/userApi.js
import axios from '../axios.customize';

export const getAllUsersApi = () => {
  return axios.get("v1/api/users");
};
