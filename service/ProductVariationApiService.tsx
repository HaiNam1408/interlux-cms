import http from '@/lib/http';
import { ProductVariation, CreateProductVariationDto, UpdateProductVariationDto } from '@/types/product';
import { PaginatedData } from '@/types/response';

export const ProductVariationApiService = {
    async getProductVariations(productId: number, page = 1, limit = 10): Promise<PaginatedData<ProductVariation> | null> {
        try {
            const response = await http.get<any>(`/product/${productId}/variation`, {
                params: { page, limit }
            });
            if (response.data) {
                return {
                    data: response.data || [],
                    meta: { total: response.data.length, page: 1, limit: 10, totalPages: 1 }
                };
            }

            return {
                data: [],
                meta: { total: 0, page: 1, limit: 10, totalPages: 1 }
            };
        } catch (error) {
            return {
                data: [],
                meta: { total: 0, page: 1, limit: 10, totalPages: 1 }
            };
        }
    },

    async getProductVariationById(productId: number, variationId: number): Promise<ProductVariation | null> {
        try {
            const response = await http.get<any>(`/product/${productId}/variation/${variationId}`);

            if (response.data) {
                const variation = response.data;
                return variation;
            }

            return null;
        } catch (error) {
            return null;
        }
    },

    async createProductVariation(productId: number, data: FormData | CreateProductVariationDto): Promise<ProductVariation | null> {
        try {
            const response = await http.post<any>(`/product/${productId}/variation`, data);
            if (response.data && response.data.data) {
                return response.data.data;
            }

            return null;
        } catch (error) {
            throw error;
        }
    },

    async updateProductVariation(productId: number, variationId: number, data: FormData | UpdateProductVariationDto): Promise<ProductVariation | null> {
        try {
            const response = await http.patch<any>(`/product/${productId}/variation/${variationId}`, data);

            if (response.data && response.data.data) {
                return response.data.data;
            }

            return null;
        } catch (error) {
            throw error;
        }
    },

    async deleteProductVariation(productId: number, variationId: number): Promise<boolean> {
        try {
            const response = await http.delete<any>(`/product/${productId}/variation/${variationId}`);
            return response.data && response.data.data ? response.data.data.success : true;
        } catch (error) {
            throw error;
        }
    }
};
