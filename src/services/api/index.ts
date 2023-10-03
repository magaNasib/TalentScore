import axios from "axios";
// import axiosInstance from "axioss";
import useAxiosPrivate from "hooks/useAxiosPrivate";


const API_URL = "https://talentscore.pythonanywhere.com/"
// const API_URL = "http://146.190.122.252/"

// export const axiosInstance = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });


const axiosPrivateInstance = useAxiosPrivate()

export const getStages = async () => {
  const { data } = await axiosPrivateInstance.get("stage-parent-lists/");
  
  return data?.stages;
};

export const getQuestions = async () => {
  const { data } = await axiosPrivateInstance.get("question-lists/umumi-suallar/");
  return data?.questions[0]?.questions;
};
