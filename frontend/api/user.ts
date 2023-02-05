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

export const signupApi = async (data: SignupReq) => {
  return await axiosInstance.post('/signup', data)
}

export const loginApi = async (data: LoginReq) => {
  return await axiosInstance.post('/login', data)
}
