import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../../constant/constant";


export const getMarks = () => {
    return useQuery({
        queryKey: ["get-marks"],
        queryFn: async () => {
            const res = await axios.get(`${BASE_URL}/marks/get`)
            const result = res.data

            if (Array.isArray(result)) return result
            if (Array.isArray(result.data)) return result.data

            return [];
        }
    })
}

export const createMarks = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data) => {
            const res = await axios.post(`${BASE_URL}/marks/create`, data)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-marks"] })
        }
    })
}

export const updateMarks = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data) => {
            const res = await axios.put(`${BASE_URL}/marks/update/${data.id}`, data)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-marks"] })
        }
    })
}

export const deleteMarks = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id) => {
            const res = await axios.post(`${BASE_URL}/marks/delete/${id}`)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-marks"] })
        }
    })
}