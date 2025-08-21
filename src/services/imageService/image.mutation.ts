import { useMutation } from "@tanstack/react-query"
import { api } from "../api"

export const useUploadImageMutation = () => {
    return useMutation({
        mutationFn: async(file: File) => {
            const formData = new FormData();
            formData.append('file', file);
            
            return await api.post('/imagekit/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => res.data)
        }
    })
}