import Axios, { AxiosRequestConfig } from 'axios'

const config: AxiosRequestConfig = {
    baseURL: process.env.REACT_APP_API_BASE_URL,
}

const token = localStorage.getItem('AUTH_TOKEN')

if(token) {
    config.headers = {
        'Authorization': `Bearer ${token}`
    }
}


const axios = Axios.create(config)

export default axios;