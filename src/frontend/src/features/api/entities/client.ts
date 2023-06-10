import axios from "axios";

import { AXIOS_CONFIG } from "../config/axios";
import { getAuthToken } from "../utils/token";

const client = axios.create(AXIOS_CONFIG);

client.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, Promise.reject);

export { client };
