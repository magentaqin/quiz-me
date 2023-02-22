import { axiosInstance } from "./axios";

export const getAnswerApi = async (params: { id: string }) => {
  return await axiosInstance.get("/answer", { params });
};
