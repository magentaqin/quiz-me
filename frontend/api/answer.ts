import { axiosInstance, axiosServerInstance } from "./axios";
import qs from "qs";

export const getAnswerApi = async (params: { id: string }) => {
  return await axiosInstance.get("/answer", { params });
};

export const getAnswerServerApi = async (params: { id: string }) => {
  return await axiosServerInstance.get("/answer", { params });
};

interface AddAnswerReq {
  questionId: string;
  content: string;
}

interface UpdateAnswerReq {
  answerId: string;
  content: string;
}

export interface ListAnswerReq {
  offset: number;
  count: number;
  questionId: string;
}

export interface ListAnswerRes {
  answerId?: string;
  content: string;
  authorId: string;
}

export const addAnswerApi = async (data: AddAnswerReq) => {
  return await axiosInstance.post("/answer/add", data);
};

export const updateAnswerApi = async (data: UpdateAnswerReq) => {
  return await axiosInstance.post("/answer/update", data);
};

export const listAnswerApi = async (params: ListAnswerReq) => {
  return await axiosInstance.get("/answer/list", {
    params,
    paramsSerializer: {
      serialize: (params) => {
        return qs.stringify(params);
      },
    },
  });
};
