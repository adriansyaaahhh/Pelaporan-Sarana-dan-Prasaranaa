import axios from "axios";
import router from "../router";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (
      err.response?.status === 403 &&
      err.response?.data?.message === "Akun diblokir admin"
    ) {
      // 🔥 AUTO LOGOUT
      localStorage.clear();
      router.push("/login");
      alert("Akun kamu diblokir admin");
    }

    return Promise.reject(err);
  }
);

export default api;
