import { useQuery } from "@tanstack/react-query"
import { api } from "../api"

export const useGetAllUsersQuery = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: async() => await api.get("/users").then(res => res.data.results)
    })
}