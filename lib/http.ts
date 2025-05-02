import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

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

class ClientAuth {
    private _token = "";

    get token() {
        return this._token;
    }

    set token(newToken: string) {
        if (typeof window === "undefined") {
            throw new Error("Cannot set token on server side");
        }
        this._token = newToken;
    }
}

export const clientAuth = new ClientAuth();

// Create axios instance with default configuration
const axiosInstance: AxiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add authorization header
axiosInstance.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined" && clientAuth.token) {
            config.headers.Authorization = `Bearer ${clientAuth.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const request = async <Response>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    url: string,
    options?: CustomOptions
): Promise<Response> => {
    const baseUrl = options?.baseUrl === undefined
        ? process.env.NEXT_PUBLIC_API_URL
        : options.baseUrl;

    const fullUrl = url.startsWith("/")
        ? `${baseUrl}${url}`
        : `${baseUrl}/${url}`;

    try {
        // Create request config
        const requestConfig: AxiosRequestConfig = {
            ...options,
            url: fullUrl,
            method,
            data: options?.data,
        };

        // Set Content-Type header for multipart/form-data if needed
        if (options?.isMultipart) {
            requestConfig.headers = {
                ...requestConfig.headers,
                'Content-Type': 'multipart/form-data'
            };
        }

        const response: AxiosResponse<Response> = await axiosInstance(requestConfig);

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            console.error(`HTTP Error: ${axiosError.response?.status}`, axiosError.response?.data);
            throw new HttpError({
                status: axiosError.response?.status || 500,
                payload: axiosError.response?.data || 'Unknown error'
            });
        } else {
            console.error("Network error or other issue", error);
            throw new Error("Network error or other issue");
        }
    }
};

const http = {
    get<Response>(url: string, options?: Omit<CustomOptions, "body">) {
        return request<Response>("GET", url, options);
    },

    post<Response>(
        url: string,
        body: any,
        options?: Omit<CustomOptions, "body">
    ) {
        // Check if body is FormData and set isMultipart flag
        const isMultipart = body instanceof FormData;
        return request<Response>("POST", url, {
            ...options,
            data: body,
            isMultipart
        });
    },

    put<Response>(
        url: string,
        body?: any,
        options?: Omit<CustomOptions, "body">
    ) {
        // Check if body is FormData and set isMultipart flag
        const isMultipart = body instanceof FormData;
        return request<Response>("PUT", url, {
            ...options,
            data: body,
            isMultipart
        });
    },

    delete<Response>(
        url: string,
        body?: any,
        options?: Omit<CustomOptions, "body">
    ) {
        return request<Response>("DELETE", url, { ...options, data: body });
    },

    patch<Response>(
        url: string,
        body?: any,
        options?: Omit<CustomOptions, "body">
    ) {
        // Check if body is FormData and set isMultipart flag
        const isMultipart = body instanceof FormData;
        return request<Response>("PATCH", url, {
            ...options,
            data: body,
            isMultipart
        });
    },
};

export default http;