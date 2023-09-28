import axios from "axios";

const instance = axios.create({
  baseURL: "http://127.0.0.1:8000/",
});

export const read = async (path: string) => (await instance.get(path)).data;
