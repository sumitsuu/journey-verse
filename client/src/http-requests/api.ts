import axios from "axios";

import errorMapper from "../helpers/error-mapper";

const $api = axios.create({
  withCredentials: true,
  baseURL: `http://localhost:${process.env.NEXT_PUBLIC_SERVER_PORT}`,
});

$api.interceptors.request.use(
  (config) => {
    return config;
  },
  (e) => {
    console.log(e);
  }
);

$api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    const mappedError = errorMapper(error);
    if (error?.response?.status === 401 && error.config && !originalRequest._isRetry) {
      originalRequest._isRetry = true;
      try {
        const response = await axios.get("http://localhost:3000/auth/refresh", {
          withCredentials: true,
        });

        if (response) {
          console.log(response.data);
        }

        return $api.request(originalRequest);
      } catch (error) {}
    }
    if (error?.response?.status === 401) {
      // console.log(error.response.statusText);
    } else {
      throw new Error(mappedError);
    }
  }
);

const GET = async (url: string, options: any = {}) => {
  return await $api.get(`http://localhost:${process.env.NEXT_PUBLIC_SERVER_PORT}/en/${url}`, options);
};

const POST = async (url: string, options: any = {}) => {
  return await $api.post(`http://localhost:${process.env.NEXT_PUBLIC_SERVER_PORT}/en/${url}`, options);
};

const DELETE = async (url: string, options: any = {}) => {
  return await $api.delete(`http://localhost:${process.env.NEXT_PUBLIC_SERVER_PORT}/en/${url}`, options);
};

const PUT = async (url: string, options: any = {}) => {
  return await $api.put(`http://localhost:${process.env.NEXT_PUBLIC_SERVER_PORT}/en/${url}`, options);
};

export { $api, DELETE, GET, POST, PUT };
