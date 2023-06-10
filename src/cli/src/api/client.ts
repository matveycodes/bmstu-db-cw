import axios from "axios";

const client = axios.create({
  baseURL: process.env.CLI_TARGET_URL,
});

export { client };
