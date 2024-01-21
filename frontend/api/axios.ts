import axios from "axios";

let token = null;
if (typeof window !== "undefined") {
  token = localStorage.getItem("quizme_token");
}

const baseURL = process.env.NEXT_PUBLIC_API_URL;

console.log("baseURL", baseURL);

let axiosInstance = axios.create({
  baseURL: `${baseURL}/api/`,
  timeout: 3000,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});


export const refreshToken = () => {
  token = localStorage.getItem("quizme_token");
  axiosInstance = axios.create({
    baseURL: `${baseURL}/api/`,
    timeout: 3000,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export { axiosInstance };
