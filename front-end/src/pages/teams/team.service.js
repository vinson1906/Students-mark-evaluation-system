
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../../constant/constant";




// get
export const getTeams = () => {
    return useQuery({
        queryKey: ["get-teams"],
        queryFn: async () => {
            const data = await axios.get(`${BASE_URL}/teams/get`)
            const result = data.data

            if (Array.isArray(result)) return result
            if (Array.isArray(result.data)) return result.data

            return [];
        }
    })
}

export const createTeams = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data) => {
            const res = await axios.post(`${BASE_URL}/teams/create`, data)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-teams"] })
        }
    })
}

export const updateTeams = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data) => {
            const res = await axios.put(`${BASE_URL}/teams/update/${data.id}`, data.team)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-teams"] })
        }
    })
}

export const deleteTeams = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id) => {
            const res = await axios.delete(`${BASE_URL}/teams/delete/${id}`)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:["get-teams"]})
        }
    })
}