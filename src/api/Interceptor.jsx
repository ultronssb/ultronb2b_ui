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
                if (response.status === '403') {
                    return window.location.href = "/"
                } else {
                    const data = await response.json();
                    return data;
                }
            }
        ]
    }
})