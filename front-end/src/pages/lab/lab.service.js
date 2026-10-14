import { useQuery, useMutation, QueryClient, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../../constant/constant";

export const getLabs = () => {
    return useQuery({
        queryKey: ["get-labs"],
        queryFn: async () => {
            const res = await axios.get(`${BASE_URL}/labs/get`)

            const result = res.data
            if (Array.isArray(result)) return result
            if (Array.isArray(result.data)) return result.data

            return [];
        }
    })
}

export const createLabs = () => {

    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data) => {
            console.log(data);

            const res = await axios.post(`${BASE_URL}/labs/create`, data)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-labs"] })
        }
    })
}

export const upadteLabs = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data) => {
            console.log(data);

            const res = await axios.put(`${BASE_URL}/labs/update/${data.id}`, data)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-labs"] })
        }
    })
}

export const deletelabs = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id) => {
            const res = await axios.delete(`${BASE_URL}/labs/delete/${id}`)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-labs"] })
        }
    })
}