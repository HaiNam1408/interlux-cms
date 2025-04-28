import http from '@/lib/http';
import axios from 'axios';
import { PaginatedData, PaginationResponse, SingleResponse } from '@/types/response';
import { Product, ProductQueryParams, ProductStatus } from '@/types/product';

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

export const ProductApiService = {
    async getProducts(page: number = 1, limit: number = 10, params?: Omit<ProductQueryParams, 'page' | 'limit'>): Promise<PaginatedData<Product> | null> {
        try {
            const queryParams: ProductQueryParams = {
                page,
                limit,
                ...params
            };

            const response = await http.get<any>('/product', { params: queryParams });
            // API trả về dữ liệu trong cấu trúc { message, statusCode, data: { data: [...], meta: {...} } }
            if (response.data) {
                // Nếu cấu trúc là { data: { data: [...], meta: {...} } }
                if (response.data.data && response.data.data.data) {
                    const result = {
                        data: response.data.data.data || [],
                        meta: response.data.data.meta || { total: 0, page: 1, limit: 10, totalPages: 1 }
                    };                    return result;
                }
                // Nếu cấu trúc là { data: [...], meta: {...} }
                else if (Array.isArray(response.data.data)) {
                    const result = {
                        data: response.data.data || [],
                        meta: response.data.meta || { total: 0, page: 1, limit: 10, totalPages: 1 }
                    };                    return result;
                }
            }

            return null;
        } catch (error) {
            console.error('Error fetching products:', error);
            return null;
        }
    },

    async getProductById(id: number) {
        try {
            const response = await http.get<any>(`/product/${id}`);
            if (response.data && response.data.data) {
                const product = response.data.data;

                return product;
            }
            return null;
        } catch (error) {
            console.error(`Error fetching product ${id}:`, error);
            return null;
        }
    },

    async getProductBySlug(slug: string) {
        try {
            const response = await http.get<any>(`/product/slug/${slug}`);
            if (response.data && response.data.data) {
                return response.data.data;
            }
            return null;
        } catch (error) {
            console.error(`Error fetching product with slug ${slug}:`, error);
            return null;
        }
    },

    async createProduct(formData: FormData) {
        try {
            // Log FormData contents for debugging            // Can't iterate through FormData entries in this environment
            // Just log that we're sending the FormData
            const response = await multipartHttp.post<any>('/product', formData);
            if (response.data && response.data.data) {
                return response.data.data;
            }
            return null;
        } catch (error: any) {
            console.error('Error creating product:', error);
            console.error('Error details:', error.response?.data || 'No response data');
            throw error;
        }
    },

    async updateProduct(id: number, formData: FormData) {
        try {
            const response = await multipartHttp.put<any>(`/product/${id}`, formData);
            if (response.data && response.data.data) {
                return response.data.data;
            }
            return null;
        } catch (error) {
            console.error(`Error updating product ${id}:`, error);
            throw error;
        }
    },

    async deleteProduct(id: number) {
        try {
            const response = await http.delete<any>(`/product/${id}`);
            return response.data && response.data.data ? response.data.data.success : true;
        } catch (error) {
            console.error(`Error deleting product ${id}:`, error);
            throw error;
        }
    },

    async updateProductStatus(id: number, status: ProductStatus) {
        try {
            const response = await axios.patch<any>(`${apiUrl}/product/${id}/status`, { status });
            if (response.data && response.data.data) {
                return response.data.data;
            }
            return null;
        } catch (error) {
            console.error(`Error updating product status ${id}:`, error);
            throw error;
        }
    },

    async getProductsByCategory(categoryId: number, page: number = 1, limit: number = 10) {
        try {
            const response = await http.get<any>(`/product`, {
                params: { page, limit, categoryId }
            });

            if (response.data && response.data.data) {
                return {
                    data: response.data.data.data || [],
                    meta: response.data.data.meta || { total: 0, page: 1, limit: 10, totalPages: 1 }
                };
            }

            return null;
        } catch (error) {
            console.error(`Error fetching products for category ${categoryId}:`, error);
            return null;
        }
    },

    async getPublishedProducts(page: number = 1, limit: number = 10) {
        try {
            const response = await http.get<any>('/product', {
                params: {
                    page,
                    limit,
                    status: ProductStatus.PUBLISHED
                }
            });

            if (response.data && response.data.data) {
                return {
                    data: response.data.data.data || [],
                    meta: response.data.data.meta || { total: 0, page: 1, limit: 10, totalPages: 1 }
                };
            }

            return null;
        } catch (error) {
            console.error('Error fetching published products:', error);
            return null;
        }
    }
};
