import axios from "axios";


// =========================================
// BACKEND URL
// =========================================

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL;


// =========================================
// AXIOS INSTANCE
// =========================================

const api = axios.create({
  baseURL: `/api`,
});


// =========================================
// SET TOKEN
// =========================================

export const setToken = (token) => {

  if (token) {

    localStorage.setItem(
      "infotrek_token",
      token
    );

  } else {

    localStorage.removeItem(
      "infotrek_token"
    );

  }

};


// =========================================
// GET TOKEN
// =========================================

export const getToken = () => {

  return localStorage.getItem(
    "infotrek_token"
  );

};


// =========================================
// REQUEST INTERCEPTOR
// =========================================

api.interceptors.request.use(
  (config) => {

    const token = getToken();

    // Only attach Authorization
    // when a token actually exists.

    if (token) {

      config.headers =
        config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;

    }

    return config;

  },

  (error) => {

    return Promise.reject(error);

  }
);


// =========================================
// API ERROR FORMATTER
// =========================================

export function formatApiErrorDetail(
  detail
) {

  if (detail == null) {

    return (
      "Something went wrong. Please try again."
    );

  }


  if (typeof detail === "string") {

    return detail;

  }


  if (Array.isArray(detail)) {

    return detail
      .map((e) => {

        if (
          e &&
          typeof e.msg === "string"
        ) {

          return e.msg;

        }

        return JSON.stringify(e);

      })
      .filter(Boolean)
      .join(" ");

  }


  if (
    detail &&
    typeof detail.msg === "string"
  ) {

    return detail.msg;

  }


  return String(detail);

}


export default api;