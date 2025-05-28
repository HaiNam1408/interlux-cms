import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1/admin';

type CustomOptions = AxiosRequestConfig & {
    baseUrl?: string;
    isMultipart?: boolean;
};

export class HttpError extends Error {
    status: number;
    payload: any;

    constructor({ status, payload }: { status: number; payload: any }) {
        super("Http Error");
        this.status = status;
        this.payload = payload;
    }
}

const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/auth/login';
            }
        }
        
        return Promise.reject(error);
    }
);

// Generic request function
const request = async <Response>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    url: string,
    options?: CustomOptions
): Promise<Response> => {
    try {
        if (options?.baseUrl) {
            axiosInstance.defaults.baseURL = options.baseUrl;
        } else {
            axiosInstance.defaults.baseURL = API_URL;
        }

        const requestConfig: AxiosRequestConfig = {
            url,
            method,
            ...options,
        };

        if (options?.isMultipart) {
            requestConfig.headers = {
                ...requestConfig.headers,
                'Content-Type': 'multipart/form-data'
            };
        }

        const response: AxiosResponse = await axiosInstance(requestConfig);
        
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            throw new HttpError({
                status: axiosError.response?.status || 500,
                payload: axiosError.response?.data || 'Unknown error'
            });
        } else {
            throw new Error("Network error or other issue");
        }
    }
};

const httpClient = {
    get<Response>(url: string, options?: Omit<CustomOptions, "data">) {
        return request<Response>("GET", url, options);
    },

    post<Response>(
        url: string,
        data?: any,
        options?: Omit<CustomOptions, "data">
    ) {
        const isMultipart = data instanceof FormData;
        return request<Response>("POST", url, {
            ...options,
            data,
            isMultipart
        });
    },

    put<Response>(
        url: string,
        data?: any,
        options?: Omit<CustomOptions, "data">
    ) {
        const isMultipart = data instanceof FormData;
        return request<Response>("PUT", url, {
            ...options,
            data,
            isMultipart
        });
    },

    delete<Response>(
        url: string,
        data?: any,
        options?: Omit<CustomOptions, "data">
    ) {
        return request<Response>("DELETE", url, { 
            ...options, 
            data 
        });
    },

    patch<Response>(
        url: string,
        data?: any,
        options?: Omit<CustomOptions, "data">
    ) {
        const isMultipart = data instanceof FormData;
        return request<Response>("PATCH", url, {
            ...options,
            data,
            isMultipart
        });
    },

    formData: {
        post<Response>(url: string, data: FormData, options?: Omit<CustomOptions, "data" | "isMultipart">) {
            return request<Response>("POST", url, {
                ...options,
                data,
                isMultipart: true
            });
        },
        
        put<Response>(url: string, data: FormData, options?: Omit<CustomOptions, "data" | "isMultipart">) {
            return request<Response>("PUT", url, {
                ...options,
                data,
                isMultipart: true
            });
        },
        
        patch<Response>(url: string, data: FormData, options?: Omit<CustomOptions, "data" | "isMultipart">) {
            return request<Response>("PATCH", url, {
                ...options,
                data,
                isMultipart: true
            });
        }
    },

    axiosInstance
};

export default httpClient;
