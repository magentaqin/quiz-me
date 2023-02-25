import { axiosInstance } from "./axios";

export const getAnswerApi = async (params: { id: string }) => {
  return await axiosInstance.get("/answer", { params });
};

interface AddAnswerReq {
  questionId: string;
  content: string;
}

export const addAnswerApi = async (data: AddAnswerReq) => {
  return await axiosInstance.post("/answer/add", data);
};
