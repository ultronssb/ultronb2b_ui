import ky from "ky";
import { BASE_URL } from "./EndPoints";

const getToken = () => {
    const token = localStorage.getItem("token");
    return token;
}

export const B2B_API = ky.create({
    prefixUrl: BASE_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
    },
    hooks: {
        beforeRequest: [
            (request) => {
                request.headers.set("Authorization", `Bearer ${getToken()}`)
            }
        ],
        beforeError: [
            async (error) => {
                const { response } = error
                return await response.json();
            }
        ],
        afterResponse: [
            async (response) => {
                if (response.status === 403 || response.status === 401) {
                    console.log(response.status, 'response.status');
                    window.location.href = "/"
                }
                return response;
            }
        ]
    },
    // retry: {
    //     limit: 2, // Retry up to 2 times
    //     methods: ["get", "put", "post", "delete", "options"], // Retry for these HTTP methods
    //     statusCodes: [408, 413, 429, 500, 502, 503, 504], // Retry for these status codes
    //     errorCodes: ["ECONNABORTED", "ETIMEDOUT"], // Retry for these error codes
    //     maxRetryAfter: 10000 // Maximum time to wait before retrying (in milliseconds)
    // }
});