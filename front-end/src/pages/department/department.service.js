import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../../constant/constant";

// Get all departments
export const getDepartment = () => {
    return useQuery({
        queryKey: ["get-department"],
        queryFn: async () => {
            const response = await axios.get(`${BASE_URL}/department/get`);

            // Supports either an array or an object containing the array
            const result = response.data;

            if (Array.isArray(result)) return result;
            if (Array.isArray(result.data)) return result.data;
            if (Array.isArray(result.departments)) return result.departments;
            console.log(result);

            return [];
        },
    });
};

// Create department
export const createDepartment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (department) => {

            console.log(department)
            const response = await axios.post(
                `${BASE_URL}/department/create`,
                department
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-department"] });
        },
    });
};

// Update department
export const updateDepartment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, department }) => {
            const response = await axios.put(
                `${BASE_URL}/department/update/${id}`,
                department
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-department"] });
        },
    });
};

// Delete department
export const deleteDepartment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id) => {
            const response = await axios.delete(
                `${BASE_URL}/department/delete/${id}`
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get-department"] });
        },
    });
};