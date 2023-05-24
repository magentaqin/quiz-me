import { axiosInstance } from "./axios";

export const uploadImageApi = async (file: File, fileKey: string) => {
  console.log('file!!!!', file)
  const formData = new FormData()
  formData.append('file', file)
  formData.append('fileKey', fileKey)
  return await axiosInstance.post("/upload/image", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
