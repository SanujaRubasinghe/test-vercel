import axios from "axios"

const API = axios.create({
    baseURL: 'https://test-hardware-backend.onrender.com/api/',
    withCredentials: true
})

export default API