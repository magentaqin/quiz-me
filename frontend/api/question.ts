import { axiosInstance } from "./axios"

export const listTagsApi = async () => {
  return await axiosInstance.get('/tag/list')
}