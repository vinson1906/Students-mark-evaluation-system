
import axios from "axios";
// export const BASE_URL = "http://localhost:7000/api"
export const BASE_URL = "https://students-mark-evaluation-system.onrender.com/api"

export const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

