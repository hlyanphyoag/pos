import { useMutation } from "@tanstack/react-query"
import { api } from "../api"
import { AxiosError } from "axios";
import { LoginCredentials, LoginResponse } from "../../types/auth";
import { ApiErrorResponse } from "../../types";


export const useLoginMutation = () => {
    return useMutation<
    LoginResponse,
    AxiosError<ApiErrorResponse>,
    {payload: LoginCredentials}
    >({
        mutationFn: async({payload} : {payload: LoginCredentials}) => {
            return await api.post('/auth/login', payload).then(res => res.data)
        }
    })
}

