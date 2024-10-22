import ky from "ky";
import { BASE_URL } from "./EndPoints";
import { useGlobalNavigate } from "../common/NavigationContext"; // Use the context for global navigation

const getToken = () => {
    const token = localStorage.getItem("token");
    return token;
}
export const createB2BAPI = () => {
    const navigate = useGlobalNavigate(); // Call the hook here

    return ky.create({
        prefixUrl: BASE_URL,
        hooks: {
            beforeRequest: [
                (request) => {
                    request.headers.set("Authorization", `Bearer ${getToken()}`);
                }
            ],
            beforeError: [
                async (error) => {
                    const { response } = error;

                    if (response.status === 403 || response.status === 401) {
                        console.log(response.status, 'response.status');
                        navigate("/"); // Navigate to index page
                        return;
                    }
                    return await response.json();
                }
            ],
            afterResponse: [
                async (response) => {
                    return response;
                }
            ],
        },
    });
};

export const B2B_API = ky.create({
    prefixUrl: BASE_URL,
    hooks: {
        beforeRequest: [
            (request) => {
                request.headers.set("Authorization", `Bearer ${getToken()}`)
            }
        ],
        beforeError: [
            async (error) => {
                const { response } = error
                const navigate = useGlobalNavigate(); // Use global navigation

                if (response.status === 403 || response.status === 401) {
                    console.log(response.status, 'response.status');
                    return navigate("/"); // Navigate to index page
                }
                return await response.json();
            }
        ],
        afterResponse: [
            async (response) => {
                return response;
            }
        ],
    },
    // retry: {
    //     limit: 2, // Retry up to 2 times
    //     methods: ["get", "put", "post", "delete", "options"], // Retry for these HTTP methods
    //     statusCodes: [408, 413, 429, 500, 502, 503, 504], // Retry for these status codes
    //     errorCodes: ["ECONNABORTED", "ETIMEDOUT"], // Retry for these error codes
    //     maxRetryAfter: 10000 // Maximum time to wait before retrying (in milliseconds)
    // }
});