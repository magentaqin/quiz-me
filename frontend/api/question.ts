import { axiosInstance } from "./axios"

export interface ListQuestionReq {
  offset: number
  count: number
}

export interface ListQuestionRes {
  title: string
  description: string
  questionId: string
  tags: string[]
}

export const listTagsApi = async () => {
  return await axiosInstance.get('/tag/list')
}

export const listQuestionsApi = async (params: ListQuestionReq) => {
  return await axiosInstance.get('/question/list', { params })
}

export const countQuestionApi = async () => {
  return await axiosInstance.get('/question/totalCount')
}