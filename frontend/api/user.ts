import { axiosInstance } from "./axios"

interface SignupReq {
  email: string;
  userName: string;
  password: string;
}

interface LoginReq {
  email: string;
  password: string;
}

interface LoginRes {
  token: string;
  userName: string;
  userId: string;
}

export const signupApi = async (params: SignupReq) => {
  return await axiosInstance.post('/signup', { params })
}

export const loginApi = async (params: LoginReq) => {
  return await axiosInstance.post('/login', { params })
}
