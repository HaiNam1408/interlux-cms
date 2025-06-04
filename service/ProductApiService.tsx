import http from '@/lib/http';
import { PaginatedData } from '@/types/response';
import { Product, ProductQueryParams, ProductStatus } from '@/types/product';

export const ProductApiService = {
    async getProducts(page: number = 1, limit: number = 10, params?: Omit<ProductQueryParams, 'page' | 'limit'>): Promise<PaginatedData<Product> | null> {
        try {
            const queryParams: ProductQueryParams = {
                page,
                limit,
                ...params
            };

            const response = await http.get<any>('/product', { params: queryParams });
            if (response.data) {
                const result = {
                    data: response.data.data || [],
                    meta: response.data.meta || { total: 0, page: 1, limit: 10, totalPages: 1 }
                };
                return result;
            }

            return null;
        } catch (error) {
            return null;
        }
    },

    async getProductById(id: number) {
        try {
            const response = await http.get<any>(`/product/${id}`);

            if (response && response.data) {
                return response.data;
            }

            return null;
        } catch (error) {
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
            return null;
        }
    },

    async createProduct(formData: FormData) {
        try {
            const response = await http.post<any>('/product', formData);
            if (response.data && response.data.data) {
                return response.data.data;
            }
            return null;
        } catch (error: any) {
            throw error;
        }
    },

    async updateProduct(id: number, formData: FormData) {
        try {
            const response = await http.put<any>(`/product/${id}`, formData);
            if (response.data && response.data.data) {
                return response.data.data;
            }
            return null;
        } catch (error) {
            throw error;
        }
    },

    async deleteProduct(id: number) {
        try {
            const response = await http.delete<any>(`/product/${id}`);
            return response.data && response.data.data ? response.data.data.success : true;
        } catch (error) {
            throw error;
        }
    },

    async updateProductStatus(id: number, status: ProductStatus) {
        try {
            const response = await http.patch<any>(`/product/${id}/status`, { status });
            if (response.data && response.data.data) {
                return response.data.data;
            }
            return null;
        } catch (error) {
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
            return null;
        }
    }
};
