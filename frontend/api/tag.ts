import { axiosInstance } from "./axios";

export interface TagItem {
  name: string;
  description?: string;
  tagId: string;
}

export const deleteTagApi = async () => {
  return await axiosInstance.post("/tag/delete");
};

export const setTagsApi = async (data: TagItem[]) => {
  return await axiosInstance.post("/tag/batchSet", { tags: data });
};

export const listTagsApi = async () => {
  return await axiosInstance.get("/tag/list");
};
