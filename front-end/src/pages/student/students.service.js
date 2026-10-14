import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../../constant/constant";

export const getStudents = () => {
    return useQuery({
        queryKey: ["get-students"],
        queryFn: async () => {
            const res = await axios.get(`${BASE_URL}/students/get`)
            const result = res.data

            if (Array.isArray(result)) return result
            if (Array.isArray(result.data)) return result.data

            return [];
        }
    })
}

//create

export const createStudents = () => {

    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (student) => {
            console.log(student);

            const res = await axios.post(`${BASE_URL}/students/create`, student)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-students"] })
        }
    })
}

//edit
export const updateStudent = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (data) => {
            console.log(data);

            const res = await axios.put(`${BASE_URL}/students/update/${data.id}`, data.student)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-students"] })
        }
    })
}

//delele

export const deleteStudents = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id) => {
            const res = await axios.delete(`${BASE_URL}/students/delete/${id}`)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-students"] })
        }
    })
}