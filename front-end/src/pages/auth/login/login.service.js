import axios from "axios";
import { BASE_URL } from "../../../constant/constant";
import { useMutation } from "@tanstack/react-query";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const Login = () => {
  return useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/user/login", data);
      return res.data;
    },
  });
};