import axios from "axios";
// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Alter defaults after instance has been created
//   instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    // Do something before the request is sent
    const token = sessionStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Do something with the request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    // Any status code that lies within the range of 2xx causes this function to trigger
    return response.data;
  },
  async (error) => {
    // Any status codes that fall outside the range of 2xx cause this function to trigger
    // Do something with response error

    const originalRequest = error.config;
    //refresh access_token if it expires
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = axios.post(`refresh`, {}, { withCredentials: true });

        const newAccessToken = res.data.accessToken;
        sessionStorage.setItem("access_token", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return instance(originalRequest);
      } catch (refreshError) {
        sessionStorage.removeItem("access_token");
        window.location.href = "/auth";
        return Promise.reject(refreshError);
      }
    }

    const backendError = error.response?.data || {
      message: "An unexpected error occurred",
      status: error.response?.status || 500,
      code: "UNKNOWN_ERROR",
    };
    return Promise.reject(backendError);
  }
);

export default instance;
