import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { api, BASE_URL } from "../../constant/constant";

export const getFaculty = () => {
    return useQuery({
        queryKey: ["get-faculty"],
        queryFn: async () => {
            const res = await api.get(`/faculty/get`)
            const result = res.data

            if (Array.isArray(result)) return result
            if (Array.isArray(result.data)) return result.data

            return [];
        }
    })
}

export const createFaculty = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data) => {
            const res = await api.post(`/faculty/create`, data)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-faculty"] })
        }
    })
}

export const updateFaculty = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data) => {
            const res = await api.put(`/faculty/update/${data.id}`, data)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-faculty"] })
        }

    })
}

export const deleteFaculty = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id) => {
            const res = await api.delete(`/faculty/delete/${id}`)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-faculty"] })
        }
    })
}