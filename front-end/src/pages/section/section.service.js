import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { api, BASE_URL } from "../../constant/constant";

export const getSection = () => {
    return useQuery({
        queryKey: ["get-section"],
        queryFn: async () => {
            const data = await api.get(`/section/get`)
            const result = data.data

            if (Array.isArray(result)) return result
            if (Array.isArray(result.data)) return result.data
            return []
        }
    })
}


//create section

export const createSection = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (section) => {
            const res = await api.post(`/section/create`,
                section
            )
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-section"] });
        },

    })
}

//update 

export const updateSection = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data) => {

            console.log("inside the service:", data.section);

            const res = await api.put(`/section/update/${data.id}`, data.section)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-section"] })
        }
    })
}

//delete

export const deleteSection = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id) => {
            console.log("id:", id)
            const res = await api.delete(`/section/delete/${id}`)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-section"] })
        }
    })
}