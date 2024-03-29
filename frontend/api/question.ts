import qs from "qs";
import { axiosInstance } from "./axios";

export interface ListQuestionReq {
  offset: number;
  count: number;
  keyword?: string;
  tags?: string[];
}

interface Tag {
  name: string;
  tagId: string;
}
export interface ListQuestionRes {
  title: string;
  description: string;
  questionId: string;
  tags: Tag[];
  level: string;
}

export interface ListTagRes {
  name: string;
  tagId: string;
}

export interface AddQuestionReq {
  tags: string[];
  title: string;
  description: string;
}

export interface UpdateQuestionReq extends AddQuestionReq {
  questionId: string;
}

export const listTagsApi = async () => {
  return await axiosInstance.get("/tag/list");
};

export const listQuestionsApi = async (params: ListQuestionReq) => {
  return await axiosInstance.get("/question/list", {
    params,
    paramsSerializer: {
      serialize: (params) => {
        return qs.stringify(params);
      },
    },
  });
};

export const countQuestionApi = async (params: { keyword: string }) => {
  return await axiosInstance.get("/question/totalCount", { params });
};

export const addQuestionApi = async (data: AddQuestionReq) => {
  return await axiosInstance.post("/question/add", data);
};

export const updateQuestionApi = async (data: UpdateQuestionReq) => {
  return await axiosInstance.post("/question/update", data);
};

export const getQuestionApi = async (params: { id: string }) => {
  return await axiosInstance.get("/question", { params });
};
