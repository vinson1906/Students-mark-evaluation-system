import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "@/constant/constant";


export const getTopStudents = () => {
    return useQuery({
        queryKey: ['top-students'],
        queryFn: async () => {
            const res = await axios.get(`${BASE_URL}/leader-board/get-student-leaderboard`)
            const result = res.data

            if (Array.isArray(result)) return result;
            if(Array.isArray(result.data)) return result.data;

            return [];
        }
    })
}

export const getTopTeams = () => {
    return useQuery({
        queryKey: ['top-teams'],
        queryFn: async () => {
            const res = await axios.get(`${BASE_URL}/leader-board/get-team-leaderboard`)
            const result = res.data

            if (Array.isArray(result)) return result;
            if(Array.isArray(result.data)) return result.data;

            return [];
        }
    })
}