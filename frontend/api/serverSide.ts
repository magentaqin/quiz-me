const baseUrl = process.env.NEXT_PUBLIC_SERVER_API_URL

export const getQuestionServerApi = async (params: { id: string }) => {
  return await fetch(`${baseUrl}/question?id=${params.id}`);
};

export const getAnswerServerApi = async (params: { id: string }) => {
  return await fetch(`${baseUrl}/answer?id=${params.id}`);
};