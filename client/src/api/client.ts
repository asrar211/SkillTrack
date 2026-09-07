import axios, { AxiosError } from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
});

apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string }>) => {
        const message =
            error.response?.data?.message ??
            "Something went wrong. Please try again.";

        return Promise.reject(new Error(message));
    }
);

export default apiClient;
