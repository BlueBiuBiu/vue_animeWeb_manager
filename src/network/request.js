import axios from "axios"

const instance = axios.create({
    baseURL: "http://localhost:8000",
    timeout: 5000
})

instance.interceptors.request.use((res,err) => {
    return res
})

instance.interceptors.response.use((res,err) => {
    return res.data
})

export default instance