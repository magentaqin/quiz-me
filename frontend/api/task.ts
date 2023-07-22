import { axiosInstance } from "./axios";

interface CodeTaskParams {
  file: File;
}

export const compileCodeApi = async (data: CodeTaskParams) => {
  const formData = new FormData()
  formData.append('file', data.file)
  formData.append('lang', 'javascript')
  const params = [[7,1,5,3,6,4]]
  formData.append('params', JSON.stringify(params))
  return await axiosInstance.post("/task/compile", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
