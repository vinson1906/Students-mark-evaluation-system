import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../../constant/constant";

export const getSection = () => {
    return useQuery({
        queryKey: ["get-section"],
        queryFn: async () => {
            const data = await axios.get(`${BASE_URL}/section/get`)
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
            const res = await axios.post(`${BASE_URL}/section/create`,
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

            const res = await axios.put(`${BASE_URL}/section/update/${data.id}`, data.section)
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
            const res = await axios.delete(`${BASE_URL}/section/delete/${id}`)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-section"] })
        }
    })
}