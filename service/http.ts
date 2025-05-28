import httpClient from '@/lib/httpClient';

export const http = httpClient;

export const httpFormData = {
    post: (url: string, data: FormData) => {
        return httpClient.formData.post(url, data);
    },
    patch: (url: string, data: FormData) => {
        return httpClient.formData.patch(url, data);
    }
};

export default httpClient;
