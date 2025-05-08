// This file is kept for backward compatibility
// It re-exports the new httpClient to ensure all existing imports continue to work
import httpClient from '@/lib/httpClient';

// Re-export the httpClient as http for backward compatibility
export const http = httpClient;

// Re-export the formData helper for backward compatibility
export const httpFormData = {
    post: (url: string, data: FormData) => {
        return httpClient.formData.post(url, data);
    },
    patch: (url: string, data: FormData) => {
        return httpClient.formData.patch(url, data);
    }
};

// Export the httpClient as the default export
export default httpClient;
