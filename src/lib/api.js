import axios from "axios";

const BACKEND_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
});

export const setToken = (token) => {
  if (token) localStorage.setItem("infotrek_token", token);
  else localStorage.removeItem("infotrek_token");
};

export const getToken = () => localStorage.getItem("infotrek_token");

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function formatApiErrorDetail(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail
      .map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e)))
      .filter(Boolean)
      .join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

export default api;