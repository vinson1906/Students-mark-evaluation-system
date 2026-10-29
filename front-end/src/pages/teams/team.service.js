
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "../../constant/constant";




// get
export const getTeams = () => {
    return useQuery({
        queryKey: ["get-teams"],
        queryFn: async () => {
            const data = await api.get(`/teams/get`)
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
            const res = await api.post(`/teams/create`, data)
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
            const res = await api.put(`/teams/update/${data.id}`, data.team)
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
            const res = await api.delete(`/teams/delete/${id}`)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-teams"] })
        }
    })
}

export const getTeamsMeta = () => {
    return useQuery({
        queryKey: ['team-meta'],
        queryFn: async () => {
            const res = await api.get(`/teams/get-meta`)
            const result = res.data

            if (Array.isArray(result)) return result;
            if (Array.isArray(result.data)) return result.data;

            return []
        }
    })
}