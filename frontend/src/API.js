import axios from "axios";

const API_URL = `http://localhost:4000/api`;

const getCompleteUrl = (url) => `${API_URL}${url}`;

export const POST = ({ url, data }) => {
  return axios.post(getCompleteUrl(url), data);
};
