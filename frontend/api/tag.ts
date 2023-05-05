import { axiosInstance } from "./axios";

export const deleteTagApi = async () => {
  return await axiosInstance.post("/tag/delete");
};