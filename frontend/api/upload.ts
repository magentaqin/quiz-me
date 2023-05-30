import { axiosInstance } from "./axios";

export const uploadImageApi = async (file: File, fileKey: string) => {
  const formData = new FormData()
  formData.append('fileKey', fileKey)
  formData.append('file', file)
  return await axiosInstance.post("/upload/image", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};


export const getImageUrlApi = async (data: { fileKey: string }) => {
  return await axiosInstance.post("/image/url", data);
};

