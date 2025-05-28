import axios from "axios"

const baseUrl = import.meta.env.VITE_VUE_API_URL;
export const instance = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json"
    }
})
