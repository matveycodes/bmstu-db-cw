import { CreateAxiosDefaults } from "axios";
import qs from "qs";

import { QS_STRINGIFY_CONFIG } from "./qs";

const AXIOS_CONFIG: CreateAxiosDefaults = {
  baseURL: process.env.REACT_APP_API_URL,
  paramsSerializer: {
    serialize: (params) => qs.stringify(params, QS_STRINGIFY_CONFIG),
  },
};

export { AXIOS_CONFIG };
