import axios from "axios";

import.meta.env.MODE === "development";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5173/api"
      : "/api",
  withCredentials: true,
});
