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
            (error) => {
                const { response } = error
            }
        ],
        afterResponse : [
            (response) => {
                if (response.status === '403') {
                    window.location.href = "/"
                }
                return response.json();
            }
        ]
    }
})