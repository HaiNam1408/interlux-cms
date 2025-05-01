import http from '@/lib/http';
import axios from 'axios';
import { PaginatedData } from '@/types/response';

// Create a custom axios instance for multipart/form-data requests
const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
const multipartHttp = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

// Add auth token to requests
multipartHttp.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface Variation {
    id: number;
    name: string;
    slug: string;
    sort?: number;
    status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
    options: VariationOption[];
    createdAt: string;
    updatedAt: string;
}

export interface VariationOption {
    id: number;
    name: string;
    slug: string;
    value?: string;
    variationId: number;
    sort?: number;
    status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
    createdAt: string;
    updatedAt: string;
}

export interface ProductVariation {
    id: number;
    productId: number;
    sku: string;
    price?: number;
    percentOff?: number;
    inventory: number;
    images?: any[];
    isDefault: boolean;
    status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
    createdAt: string;
    updatedAt: string;
    options?: ProductVariationOption[];
}

export interface ProductVariationOption {
    id: number;
    productVariationId: number;
    variationOptionId: number;
    variationOption?: VariationOption;
}

export const VariationApiService = {
    // Variation APIs
    async getVariations(page = 1, limit = 10) {
        try {
            const response = await http.get<any>(`/variation?page=${page}&limit=${limit}`);
            if (response && response.data) {
                return response.data;
            }

            return null;
        } catch (error) {
            console.error('Error fetching variations:', error);
            return null;
        }
    },

    async getVariationById(id: number) {
        try {
            const response = await http.get<any>(`/variation/${id}`);
            console.log(`Variation ${id} response:`, response);

            // Check if the response has the expected structure
            if (response && response.data) {
                // If the response is already in the expected format
                if (response.data.id) {
                    return response.data;
                }
                // If the response is in the SingleResponse format
                else if (response.data.data && response.data.data.id) {
                    return response.data.data;
                }
            }

            return null;
        } catch (error) {
            console.error(`Error fetching variation ${id}:`, error);
            return null;
        }
    },

    async createVariation(data: FormData | any) {
        try {
            const response = data instanceof FormData ? await multipartHttp.post<any>('/variation', data) : await http.post<any>('/variation', data);
            return response.data;
        } catch (error) {
            console.error('Error creating variation:', error);
            throw error;
        }
    },

    async updateVariation(id: number, data: FormData | any) {
        try {
            const response = data instanceof FormData ? await multipartHttp.patch<any>(`/variation/${id}`, data) : await http.patch<any>(`/variation/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating variation ${id}:`, error);
            throw error;
        }
    },

    async deleteVariation(id: number) {
        try {
            const response = await http.delete<any>(`/variation/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting variation ${id}:`, error);
            throw error;
        }
    },

    // Variation Option APIs
    async getVariationOptions(variationId: number, page = 1, limit = 10) {
        try {
            const response = await http.get<any>(`/variation/${variationId}/option?page=${page}&limit=${limit}`);
            if (response && response.data) {
                return response.data;
            }

            return null;
        } catch (error) {
            console.error(`Error fetching variation options for variation ${variationId}:`, error);
            return null;
        }
    },

    async getVariationOptionById(variationId: number, id: number) {
        try {
            const response = await http.get<any>(`/variation/${variationId}/option/${id}`);
            if (response && response.data) {
                return response.data;
            }

            return null;
        } catch (error) {
            console.error(`Error fetching variation option ${id}:`, error);
            return null;
        }
    },

    async createVariationOption(variationId: number, data: FormData | any) {
        try {
            const response = data instanceof FormData ? await multipartHttp.post<any>(`/variation/${variationId}/option`, data) : await http.post<any>(`/variation/${variationId}/option`, data);
            return response.data;
        } catch (error) {
            console.error('Error creating variation option:', error);
            throw error;
        }
    },

    async updateVariationOption(variationId: number, id: number, data: FormData | any) {
        try {
            const response = data instanceof FormData ? await multipartHttp.patch<any>(`/variation/${variationId}/option/${id}`, data) : await http.patch<any>(`/variation/${variationId}/option/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating variation option ${id}:`, error);
            throw error;
        }
    },

    async deleteVariationOption(variationId: number, id: number) {
        try {
            const response = await http.delete<any>(`/variation/${variationId}/option/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting variation option ${id}:`, error);
            throw error;
        }
    },

    // Product Variation APIs
    async getProductVariations(productId: number, page = 1, limit = 10) {
        try {
            const response = await http.get<any>(`/product/${productId}/variation?page=${page}&limit=${limit}`);
            console.log('Product variations response:', response);

            // Check if the response has the expected structure
            if (response && response.data) {
                // If the response is already in the PaginatedData format
                if (response.data.data && response.data.meta) {
                    return response.data;
                }
                // If the response is in the PaginationResponse format
                else if (response.data.data && response.data.data.data && response.data.data.meta) {
                    return response.data.data;
                }
            }

            return null;
        } catch (error) {
            console.error(`Error fetching product variations for product ${productId}:`, error);
            return null;
        }
    },

    async getProductVariationById(productId: number, id: number) {
        try {
            const response = await http.get<any>(`/product/${productId}/variation/${id}`);
            console.log('Product variation by ID response:', response);

            // Check if the response has the expected structure
            if (response && response.data) {
                // If the response is already in the expected format
                if (response.data.id) {
                    return response.data;
                }
                // If the response is in the SingleResponse format
                else if (response.data.data && response.data.data.id) {
                    return response.data.data;
                }
            }

            return null;
        } catch (error) {
            console.error(`Error fetching product variation ${id}:`, error);
            return null;
        }
    },

    async createProductVariation(productId: number, data: FormData | any) {
        try {
            const response = data instanceof FormData ? await multipartHttp.post<any>(`/product/${productId}/variation`, data) : await http.post<any>(`/product/${productId}/variation`, data);
            return response.data;
        } catch (error) {
            console.error('Error creating product variation:', error);
            throw error;
        }
    },

    async updateProductVariation(productId: number, id: number, data: FormData | any) {
        try {
            const response = data instanceof FormData ? await multipartHttp.patch<any>(`/product/${productId}/variation/${id}`, data) : await http.patch<any>(`/product/${productId}/variation/${id}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating product variation ${id}:`, error);
            throw error;
        }
    },

    async deleteProductVariation(productId: number, id: number) {
        try {
            const response = await http.delete<any>(`/product/${productId}/variation/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting product variation ${id}:`, error);
            throw error;
        }
    }
};
