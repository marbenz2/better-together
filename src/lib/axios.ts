import axios, { AxiosError } from "axios";

export const axiosInstance = axios.create({
  baseURL:
    process.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
  withCredentials: true,
});

export type { AxiosError };
