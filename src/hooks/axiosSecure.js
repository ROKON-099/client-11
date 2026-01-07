import axios from "axios";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

/* ======================
   REQUEST INTERCEPTOR
====================== */
axiosSecure.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ======================
   RESPONSE INTERCEPTOR
====================== */
axiosSecure.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const currentPath = window.location.pathname;

    // 🔥 Handle auth errors safely
    if ((status === 401 || status === 403) && currentPath !== "/login") {
      localStorage.removeItem("token");

      // prevent infinite redirect loop
      window.location.replace("/login");
    }

    return Promise.reject(error);
  }
);

export default axiosSecure;
