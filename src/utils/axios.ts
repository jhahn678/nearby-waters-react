import Axios from 'axios'


const axios = Axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
})

export default axios;