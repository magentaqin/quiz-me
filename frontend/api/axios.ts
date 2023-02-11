import axios from 'axios'

let token = null
if (typeof window !== 'undefined') {
  token = localStorage.getItem('quizme_token')
}

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api/',
    timeout: 3000,
    headers: {
      Authorization: `Bearer ${token}`
    }
});
