import axios, { AxiosInstance } from "axios";

export const api : AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": 'application/json'
  }
});

api.interceptors.request.use((config ) =>  {
    const token = localStorage.getItem('token');
    // console.log("TokenFromApi:", token)
    config.headers.Authorization = `Bearer ${token}`
    return config;
  }, function (error) {
    console.log('Err:', error)
    return Promise.reject(error);
  });

// Add a response interceptor
api.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    console.log("Err:", error)
    return Promise.reject(error);
  });